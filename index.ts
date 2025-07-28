import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const accessKeyId = process.env.AWS_SES_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SES_SECRET_KEY || "";

const client = new SESClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const params = {
  Source: "noreply@mylamp.in", // Must be a verified email in SES
  Destination: {
    ToAddresses: ["ashutoshkrsinghsm@gmail.com"], // recipient
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
  <body>
    <div>
      <h2>Login OTP for MyLamp.in</h2>
      <p>Dear user,</p>
      <p>Your OTP is: <strong>593218</strong></p>
      <p>This code will expire in 10 minutes. Please do not share this code with anyone.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,<br>Team MyLamp.in</p>
    </div>
  </body>
</html>`,
      },
    },
  },
};

try {
  console.log("hello");
  
  const send = async () => {
    const command = new SendEmailCommand(params);
    const data = await client.send(command);

    console.log(data);
  };

  send();
} catch (error) {
  console.log(error);
}
