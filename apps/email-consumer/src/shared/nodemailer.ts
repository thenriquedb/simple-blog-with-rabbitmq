import nodemailer from 'nodemailer';
import env from '../constants/env';

const transporter = nodemailer.createTransport({
  host: env.NODEMAILER_HOST,
  port: env.NODEMAILER_PORT,
  secure: false,
});

export { transporter };