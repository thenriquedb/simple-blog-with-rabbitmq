declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODEMAILER_HOST: string;
      NODEMAILER_PORT: number;
      NODEMAILER_SENDER_EMAIL: string;
      RABBITMQ_HOST: string;
      RABBITMQ_PASSWORD: string;
      RABBITMQ_PORT: number;
      RABBITMQ_USERNAME: string;

    }
  }
}