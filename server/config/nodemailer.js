import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
const smtpConnectionTimeout = Number(process.env.SMTP_CONNECTION_TIMEOUT || 15000);
const smtpGreetingTimeout = Number(process.env.SMTP_GREETING_TIMEOUT || 10000);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
  family: 4,
  connectionTimeout: smtpConnectionTimeout,
  greetingTimeout: smtpGreetingTimeout,
    auth: {
    user: smtpUser,
    pass: smtpPass,
    },
  });

export const verifyTransporter = async () => {
  try {
    if (!smtpUser || !smtpPass) {
      console.error('SMTP credentials missing: set SMTP_USER and SMTP_PASS');
      return;
    }

    await transporter.verify();
    console.log(`SMTP ready (${smtpHost}:${smtpPort}) as ${smtpUser}`);
  } catch (error) {
    console.error('SMTP verification failed:', {
      message: error.message,
      code: error.code,
      response: error.response,
      command: error.command,
    });
  }
};

export default transporter;