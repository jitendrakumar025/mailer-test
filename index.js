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
  Source: "noreply@mylamp.in",
  Destination: {
    ToAddresses: ["ashutoshkrsinghsm@gmail.com"],
  },
  Message: {
    Subject: {
      Data: "Your OTP Code to Login",
      Charset: "UTF-8",
    },
    Body: {
      Text: {
        Charset: "UTF-8",
        Data: `Dear user,

You requested a one-time password (OTP) to log in to your account.

Your OTP is: 593218

This code will expire in 10 minutes. Please do not share this code with anyone.

If you did not request this, please ignore this email.

Thanks,
Team MyLamp.in`,
      },
      Html: {
        Charset: "UTF-8",
        Data: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Login OTP for MyLamp.in</h2>
      <p>Dear user,</p>
      <p>You requested a one-time password (OTP) to log in to your account.</p>
      <p style="font-size: 20px; font-weight: bold; color: #2c3e50; background: #ecf0f1; padding: 10px; display: inline-block; border-radius: 4px;">593218</p>
      <p>This code will expire in 10 minutes. Please do not share this code with anyone.</p>
      <p>If you did not request this, please ignore this email.</p>
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
