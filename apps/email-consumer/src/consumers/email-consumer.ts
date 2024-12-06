import { transporter } from "../shared/nodemailer";
import { getRabbitMQInstance } from "../shared/rabbitMQ";

export async function emailConsumer() {
  const channel = await getRabbitMQInstance();

  channel.consume('client.email', async (consumeMessage) => {
    if (consumeMessage) {
      const { email, subject, body } = JSON.parse(consumeMessage.content.toString());
      console.log('Email received', email);

      try {
        const info = await transporter.sendMail({
          from: process.env.NODEMAILER_SENDER_EMAIL,
          to: email,
          subject,
          text: body,
        });
        channel.ack(consumeMessage);
        console.log('Email sent to ' + info.envelope.to);
      } catch (error) {
        console.error('Error sending email', error.message);
        channel.nack(consumeMessage, false);
      }
    }
  });
}
