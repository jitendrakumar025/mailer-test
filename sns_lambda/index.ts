import { SNSEvent, SNSMessage } from "aws-lambda";
import dotenv from "dotenv";

dotenv.config();

export const handler = async (event: SNSEvent): Promise<void> => {
  for (const record of event.Records) {
    const sns = record.Sns;
    console.log("Message ID:", sns.MessageId);
    console.log("Subject:", sns.Subject);
    console.log("Message:", sns.Message);

    try {
      const parsed = JSON.parse(sns.Message);
      console.log("Parsed Message:", parsed);
    } catch (err) {
      console.error("Invalid JSON message:", sns.Message);
    }
  }
};
