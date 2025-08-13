const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const XLSX = require("xlsx");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const emailRoutes = require("./routes/email");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_SES_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SES_SECRET_KEY;

AWS.config.update({ region });
const ses = new AWS.SES({
  accessKeyId,
  secretAccessKey,
});

const workbook = XLSX.readFile(path.join(__dirname, "rec2.xlsx"));

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const sendEmail = async (email, name) => {
  const params = {
    Source: "wiZe Team <no-reply@mail.mylamp.in>'",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "wiZe Pro Access – AI Mock Interviewer | IIT Kharagpur",
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Dear ${name},

Your wiZe Pro access has been activated. You can now access the AI Mock Interviewer and other premium features.

Visit: https://wize.co.in/interviews

All the best!
Team wiZe (myLamp AI)`,
        },
        Html: {
          Charset: "UTF-8",
          Data: `<!DOCTYPE html>
<html>

<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Your wiZe Pro Access is Now Live!</h2>
    <p>Dear ${name},</p>
    <p>Your wiZe Pro access has been activated! You can now use the <strong>AI Mock Interviewer</strong> along with the <strong>wiZe Premium Platform</strong>.</p>
    <p><strong>Access Link:</strong> <a href="https://wize.co.in/interviews">Click here</a></p>
    <p>Pick any interview and give it a shot!</p>
    <i>
        (Login → Upload CV → Start Interview → Get Analysis)


    </i>
    <p>All the best!</p>
    <br>
    <p>--<br>
        Thanks and Regards,<br>
    <div style="display: flex; gap: 8px; ">
        <img src="https://res.cloudinary.com/dqidphson/image/upload/v1753986808/wize_logo_whitebg_hdi0qn.png" style="width: 100px; height: 100px;">
        </img>
        <div style="padding-top: 0.5rem; padding-left: 0.5rem;">
            <strong>Team</strong><br>
            wiZe (myLamp AI)<br>
            Whatsapp: <div>92441 60441</div>
            <a href="https://www.linkedin.com/company/mylamp-ai/">LinkedIn</a> |
            <a href="mailto:arpit@mylamp.co.in">Email</a> |
            <a href="https://wize.co.in/">Website</a></p>
        </div>
    </div>
</body>
</html>`,
        },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(`✅ Email sent to ${email}: MessageId = ${result.MessageId}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${email}:`, err.message);
  }
};

// const main = async () => {
//   const sentEmails = new Set();

//   for (let i = 1; i < rows.length; i++) {
//     const row = rows[i];

//     const nameCell = (row[2] || "").toString().trim();
//     const name = nameCell.split(" ")[0] || "Student";

//     const email = (row[3] || "").toString().trim().toLowerCase();

//     if (!email.includes("@")) {
//       console.warn(`⚠️ Skipping invalid email at row ${i + 1}`);
//       continue;
//     }

//     if (sentEmails.has(email)) {
//       console.log(`⏩ Skipping duplicate: ${email}`);
//       continue;
//     }

//     // console.log(`📧 Sending to ${name} <${email}>`);

//     await sendEmail(email, name);
//     sentEmails.add(email);

//     const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

//     const getRandomDelay = () => {
//       return Math.floor(Math.random() * 1000) + 1000;
//     };

//     await sleep(getRandomDelay());
//   }

//   console.log(
//     `✅ Finished sending emails to ${sentEmails.size} unique addresses.`
//   );
// };

// main();

app.use("/api", emailRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
