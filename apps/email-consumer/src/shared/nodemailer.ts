import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
});

export { transporter };