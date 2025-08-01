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
  Source: '"MyLamp Team" <support@mail.mylamp.in>',
  Destination: {
    ToAddresses: ["jitu.wize@gmail.com"],
  },
  Message: {
    Subject: {
      Data: "Support testing email",
      Charset: "UTF-8",
    },
    Body: {
      Text: {
        Data: 'Hi there,\n\nThis is a test email. Please ignore.\n\n– Team MyLamp',
      },
    },
  },
};

ses.sendEmail(params).promise().then(console.log).catch(console.error);
