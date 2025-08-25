import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465, // 465:true, 587:false
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    requireTLS: true, // 587'de TLS'i zorla
  });

  return transporter;
}

// Opsiyonel: deploy sonrası bir kere verify çağırıp logla
export async function verifyMailer() {
  try {
    await getTransporter().verify();
    console.log('MAILER_OK');
  } catch (e) {
    console.error('MAILER_FAIL', e);
  }
}
