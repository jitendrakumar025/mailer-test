import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "ap-south-1" }); // Change region as needed

const params = {
  Source: "noreply@mylamp.in",
  Destination: {
    ToAddresses: ["ashutoshkrsinghsm@gmail.com"],
  },
  Message: {
    Subject: {
      Data: "Your wiZe Pro Access is Now Live!",
      Charset: "UTF-8",
    },
    Body: {
      Text: {
        Charset: "UTF-8",
        Data: `Dear Student,

Your wiZe Pro access has been activated! You can now use the AI Mock Interviewer along with the wiZe Premium Platform, as recommended by the Consulting & Analytics Club, IIT Guwahati.

Access Link: Click here
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
        Data: `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Your wiZe Pro Access is Now Live!</h2>
    <p>Dear Student,</p>
    <p>Your <strong>wiZe Pro</strong> access has been activated! You can now use the <strong>AI Mock Interviewer</strong> along with the wiZe Premium Platform, as recommended by the <strong>Consulting & Analytics Club, IIT Guwahati</strong>.</p>
    <p><strong>Access Link:</strong> <a href="https://your-platform-link.com">Click here</a></p>
    <p>Pick any interview and give it a shot!</p>
    <ul>
      <li>Login</li>
      <li>Upload CV</li>
      <li>Start Interview</li>
      <li>Get Analysis</li>
    </ul>
    <p>If you face any issues or want a specific interview, just reply to this email.</p>
    <p>All the best!</p>
    <br>
    <p>--<br>
    Thanks and Regards,<br>
    <strong>Team</strong><br>
    wiZe (myLamp AI)<br>
    Whatsapp: <a href="https://wa.me/919244160441">92441 60441</a><br>
    <a href="https://linkedin.com/company/wize-ai">LinkedIn</a> | 
    <a href="mailto:support@mylamp.in">Email</a> | 
    <a href="https://mylamp.in">Website</a></p>
  </body>
</html>`,
      },
    },
  },
};

export const handler = async (event) => {
  try {
    const command = new SendEmailCommand(params);
    const data = await sesClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully",
        messageId: data.MessageId,
      }),
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
    };
  }
};

handler("");
