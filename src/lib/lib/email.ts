/* eslint-disable prettier/prettier */
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  return transporter;
}

export async function sendVerificationEmail(to: string, link: string) {
  const t = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto">
      <h2>Hesabınızı doğrulayın</h2>
      <p>Kaydınız başarıyla oluşturuldu. Aktivasyon için aşağıdaki linke tıklayın:</p>
      <p><a href="${link}">${link}</a></p>
    </div>
  `;
  await t.sendMail({ from, to, subject: 'E-posta Doğrulama', html });
}

export async function sendResetEmail(to: string, link: string) {
  const t = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto">
      <h2>Şifre Sıfırlama</h2>
      <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
      <p><a href="${link}">${link}</a></p>
      <p style="color:#666;font-size:12px">Bağlantı 1 saat geçerlidir.</p>
    </div>
  `;
  await t.sendMail({ from, to, subject: 'Şifre Sıfırlama', html });
}
