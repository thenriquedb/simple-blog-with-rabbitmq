import dotenv from 'dotenv';
dotenv.config();

import { emailConsumer } from './consumers/email-consumer';

(async () => {
  try {
    await emailConsumer();
  } catch (error) {
    console.error(error);
  }
})()