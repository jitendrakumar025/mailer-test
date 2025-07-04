const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

exports.handler = async () => {
  const params = {
    Source: 'ashutoshkrsinghsm@gmail.com',
    Destination: {
      ToAddresses: ['ashutoshkrsinghsm@gmail.com'],
    },
    Message: {
      Subject: { Data: 'Hello from Lambda + SES' },
      Body: {
        Html: {
          Data: '<h1>Hello!</h1><p>This is a test email.</p>',
        },
      },
    },
  };

  await ses.sendEmail(params).promise();
  return { statusCode: 200, body: 'Email sent!' };
};