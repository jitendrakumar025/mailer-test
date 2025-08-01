// sendEmails.js
import { readFile, utils } from "xlsx";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import fs from "fs";

// Initialize SES
const sesClient = new SESClient({ region: "ap-south-1" });

const getHtmlContent = (name) => `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2>Your wiZe Pro Access is Now Live!</h2>
  <p>Dear ${name || "Student"},</p>
  <p>Your <strong>wiZe Pro</strong> access has been activated! You can now use the <strong>AI Mock Interviewer</strong>
     along with the wiZe Premium Platform, as recommended by the <strong>Consulting & Analytics Club, IIT Guwahati</strong>.</p>
  <p><strong>Access Link:</strong> <a href="https://wize.co.in/interviews">Click here</a></p>
  <p>Pick any interview and give it a shot!</p>
  <i>(Login → Upload CV → Start Interview → Get Analysis)</i>
  <p>If you face any issues or want a specific interview, just reply to this email.</p>
  <p>All the best!</p><br>
  <p>--<br>
     Thanks and Regards,<br>
     <strong>Team</strong><br>
     wiZe (myLamp AI)<br>
     Whatsapp: 92441 60441<br>
     <a href="https://www.linkedin.com/company/mylamp-ai/">LinkedIn</a> |
     <a href="mailto:arpit@mylamp.co.in">Email</a> |
     <a href="https://wize.co.in/">Website</a>
  </p>
</body>
</html>`;

const sendEmail = async (name, email) => {
  const params = {
    Source: "noreply@mylamp.in",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Your wiZe Pro Access is Now Live!",
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Dear ${name},

Your wiZe Pro access has been activated! You can now use the AI Mock Interviewer along with the wiZe Premium Platform, as recommended by the Consulting & Analytics Club, IIT Guwahati.

Access Link: https://wize.co.in/interviews
Pick any interview and give it a shot!
(Login → Upload CV → Start Interview → Get Analysis)

If you face any issues or want a specific interview, just reply to this email.

All the best!

--
Thanks and Regards,
Team
wiZe (myLamp AI)
Whatsapp: 92441 60441
LinkedIn | Email | Website`,
        },
        Html: {
          Charset: "UTF-8",
          Data: getHtmlContent(name),
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const data = await sesClient.send(command);
    console.log(`✅ Email sent to ${email} | Message ID: ${data.MessageId}`);
  } catch (err) {
    console.error(`❌ Failed to send to ${email}:`, err.message);
  }
};

const main = async () => {
  const workbook = readFile("recipients.xlsx"); // Your Excel file
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = utils.sheet_to_json(sheet, { header: 1 });

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[2].split(" ")[0]; // Column C
    const email = row[3]; // Column D

    console.log(name, email);

    // if (email && typeof email === "string") {
    //   await sendEmail(name, email.trim());
    // }
  }
};

main();
