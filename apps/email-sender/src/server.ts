import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

import { getRabbitMQInstance } from './shared/rabbitMQ';

// Looking to send emails in production? Check out our Email API/SMTP product!
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

async function run() {
  const channel = await getRabbitMQInstance();
  channel.consume('client.email', async (consumeMessage) => {
    if (consumeMessage) {
      const { email, subject, body } = JSON.parse(consumeMessage.content.toString());
      const retriesCount = consumeMessage.properties.headers?.['x-retries-count'] as number;
      console.log('Email received', consumeMessage.properties.headers);

      const mailOptions = {
        from: 'thenriquedb@gmail.com',
        to: email,
        subject,
        text: body
      };

      if (retriesCount > 3) {
        console.log('Email rejected after 3 retries');
      }

      try {
        const info = await transporter.sendMail(mailOptions);
        channel.ack(consumeMessage);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error('Error sending email', error.message);
      }
    }
  });
}

(async () => {
  try {
    await run();
  } catch (error) {
    console.error(error);
  }
})()