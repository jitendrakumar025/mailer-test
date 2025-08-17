const express = require("express");
const router = express.Router();
const {
  SESClient,
  ListTemplatesCommand,
  CreateTemplateCommand,
  UpdateTemplateCommand,
  DeleteTemplateCommand,
  SendBulkTemplatedEmailCommand,
  SendBulkEmailCommand,
  SendEmailCommand,
  GetTemplateCommand,
} = require("@aws-sdk/client-ses");
const { EmailLog, BulkBatch } = require("../models/MailerSchemas");

require("dotenv").config();

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

/**
 * 1. Get all templates from SES
 */
router.get("/templates/get-all", async (req, res) => {
  try {
    // Step 1: Get list of templates (metadata only)
    const listCommand = new ListTemplatesCommand({ MaxItems: 50 });
    const listResponse = await ses.send(listCommand);

    const templates = listResponse.TemplatesMetadata || [];

    // Step 2: For each template, fetch full details
    const templateDetails = await Promise.all(
      templates.map(async (t) => {
        try {
          const getCommand = new GetTemplateCommand({ TemplateName: t.Name });
          const detail = await ses.send(getCommand);
          return {
            ...t,
            ...detail.Template, // includes SubjectPart, HtmlPart, TextPart
          };
        } catch (err) {
          console.error(`Error fetching template ${t.Name}:`, err);
          return { ...t, error: "Could not fetch details" };
        }
      })
    );

    res.json(templateDetails);
  } catch (err) {
    console.error("Error listing templates", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2. Add new template
 */
router.post("/templates/create-new", async (req, res) => {
  try {
    const { TemplateName, SubjectPart, TextPart, HtmlPart } = req.body;
    const command = new CreateTemplateCommand({
      Template: {
        TemplateName,
        SubjectPart,
        TextPart,
        HtmlPart,
      },
    });
    await ses.send(command);
    res.json({ message: "Template created successfully" });
  } catch (err) {
    console.error("Error creating template", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 3. Update existing template
 */
router.put("/templates/update/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { SubjectPart, TextPart, HtmlPart } = req.body;
    const command = new UpdateTemplateCommand({
      Template: {
        TemplateName: name,
        SubjectPart,
        TextPart,
        HtmlPart,
      },
    });
    await ses.send(command);
    res.json({ message: "Template updated successfully" });
  } catch (err) {
    console.error("Error updating template", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 4. Delete template
 */
router.delete("/templates/delete/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const command = new DeleteTemplateCommand({ TemplateName: name });
    await ses.send(command);
    res.json({ message: "Template deleted successfully" });
  } catch (err) {
    console.error("Error deleting template", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 5. Send bulk emails with or without template
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post("/send-bulk", async (req, res) => {
  try {
    const {
      sourceEmail,
      templateName,
      defaultTemplateData,
      destinations,
      subject,
      bodyHtml,
      bodyText,
    } = req.body;

    if (!sourceEmail || !destinations?.length) {
      return res
        .status(400)
        .json({ error: "sourceEmail and destinations are required" });
    }
    const bulkBatch = await BulkBatch.create({
      sourceMail: sourceEmail,
      totalRecipients: destinations.length,
      templateName: templateName || null,
    });

    const results = [];
    const batchSize = 50; // SES bulk limit
    const sendRate = 14; // adjust to your SES limit (emails/sec)

    // Split into batches of 50
    for (let i = 0; i < destinations.length; i += batchSize) {
      const batch = destinations.slice(i, i + batchSize);

      if (templateName) {
        // ----------- With Template ------------
        const command = new SendBulkTemplatedEmailCommand({
          Source: sourceEmail,
          Template: templateName,
          DefaultTemplateData: JSON.stringify(defaultTemplateData || {}),
          Destinations: batch.map((dest) => ({
            Destination: { ToAddresses: [dest.email] },
            ReplacementTemplateData: JSON.stringify(dest.replacements || {}),
          })),
        });

        const response = await ses.send(command);
        for (let j = 0; j < batch.length; j++) {
          const sesResp = response.Status[j];
          const recipientDoc = await EmailLog.create({
            email: batch[j].email,
            sesMessageId: sesResp.MessageId || null,
            status: sesResp.Status,
            error: sesResp.Error || null,
            bulkBatchId: bulkBatch._id,
          });
        }
        results.push({
          bulkBatchId: bulkBatch._id,
          batch: i / batchSize + 1,
          response,
        });
      } else {
        // ----------- Without Template (manual loop) ------------
        for (const dest of batch) {
          const command = new SendEmailCommand({
            Source: sourceEmail,
            Destination: { ToAddresses: [dest.email] },
            Message: {
              Subject: { Data: subject },
              Body: {
                Text: { Data: bodyText || "" },
                Html: { Data: bodyHtml || "" },
              },
            },
          });
          const response = await ses.send(command);
          for (let j = 0; j < batch.length; j++) {
            const sesResp = response.Status[j];
            
            const recipientDoc = await EmailLog.create({
              email: batch[j].email,
              sesMessageId: sesResp.MessageId || null,
              status: sesResp.Status,
              error: sesResp.Error || null,
              bulkBatchId: bulkBatch._id,
            });
          }
          results.push({
            bulkBatchId: bulkBatch._id,
            email: dest.email,
            response,
          });
        }
      }

      // Throttle: SES send rate (14 emails/sec → ~1 batch/sec)
      if ((i / batchSize + 1) % sendRate === 0) {
        console.log(`Throttling... waiting 1 second`);
        await sleep(1000);
      }
    }

    res.json({ message: "Bulk emails queued successfully", results });
  } catch (err) {
    console.error("Error sending bulk email", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 6. Get template details by name
 */
router.get("/templates/view/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const command = new GetTemplateCommand({ TemplateName: name });
    const response = await ses.send(command);

    res.json(response.Template || {});
  } catch (err) {
    console.error("Error fetching template details", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/bulk-batches?range=7d|30d|all
 */
router.get("/bulk-batches", async (req, res) => {
  try {
    const { range } = req.query;
    let filter = {};

    if (range === "7d") {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      filter = { createdAt: { $gte: date } };
    } else if (range === "30d") {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      filter = { createdAt: { $gte: date } };
    } // else "all" → no filter

    const batches = await BulkBatch.find(filter).sort({ createdAt: -1 });

    res.json(batches);
  } catch (err) {
    console.error("Error fetching bulk batches", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/bulk-batches/:id/recipients
 */
router.get("/bulk-batches/:id/recipients", async (req, res) => {
  try {
    const { id } = req.params;
    const recipients = await EmailLog.find({ bulkBatchId: id }).sort({
      createdAt: -1,
    });
    res.json(recipients);
  } catch (err) {
    console.error("Error fetching recipients", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
