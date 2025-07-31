import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_SES_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SES_SECRET_KEY;

AWS.config.update({ region });
const ses = new AWS.SES({
  accessKeyId,
  secretAccessKey,
});

const params = {
  Source: '"MyLamp Team" <outreach@mail.mylamp.in>',
  Destination: {
    ToAddresses: ["jitu.wize@gmail.com","tagsworldarpit@gmail.com","ashutoshasharsiper@gmail.com","jitendrakumarbunkar85@gmail.com"],
  },
  Message: {
    Subject: {
      Data: "Outreach testing6...",
      Charset: "UTF-8",
    },
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Test Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <img src="https://wize.co.in/images/org_logo.png" width="100px" height="100px" alt="wize_logo" />
      <p>Dear user,</p>
      <p>This is testing email , please ignore this email.</p>
      <br>
      <p>Thanks,<br><strong>Team MyLamp.in</strong></p>
    </div>
  </body>
</html>`,
      },
    },
  },
};

ses.sendEmail(params).promise().then(console.log).catch(console.error);
