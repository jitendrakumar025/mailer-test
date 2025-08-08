const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_SES_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SES_SECRET_KEY;

AWS.config.update({ region });

const ses = new AWS.SES({
  accessKeyId,
  secretAccessKey,
});

const sendEmail = async (email, name) => {
  const params = {
    Source: "wiZe Team <no-reply@mail.mylamp.in>",
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
          Data: `<html>...your HTML content...</html>`, // Keep full HTML here
        },
      },
    },
  };

  const result = await ses.sendEmail(params).promise();
  console.log(`✅ Email sent to ${email}: MessageId = ${result.MessageId}`);
  return result;
};

module.exports = sendEmail;
