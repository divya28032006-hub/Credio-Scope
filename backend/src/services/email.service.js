import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    family: 4, // force IPv4 - Render's outbound network can't reach Gmail over IPv6
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000
  });

  return transporter;
};

const clientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

const send = async ({ to, subject, html, text }) => {
  if (!process.env.SMTP_HOST) {
    console.log(`[email:skipped - no SMTP_HOST set] to=${to} subject="${subject}"`);
    return;
  }

  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || 'CrediScope <no-reply@crediscope.app>',
      to,
      subject,
      html,
      text
    });
  } catch (err) {
    console.error(`[email:failed] to=${to} subject="${subject}" -`, err.message);
  }
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const link = `${clientUrl()}/reset-password/${resetToken}`;

  await send({
    to: user.email,
    subject: 'Reset your CrediScope password',
    text: `Hi ${user.name}, reset your password here: ${link} (expires in ${process.env.RESET_TOKEN_EXPIRES_MIN || 30} minutes)`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px">
        <h2 style="color:#1B2A22">Reset your password</h2>
        <p>Hi ${user.name}, we received a request to reset your CrediScope password.</p>
        <p style="margin:24px 0">
          <a href="${link}" style="background:#B8862B;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold">
            Reset password
          </a>
        </p>
        <p style="color:#666;font-size:13px">This link expires in ${process.env.RESET_TOKEN_EXPIRES_MIN || 30} minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `
  });
};

export const sendCashReminderEmail = async (user) => {
  const link = clientUrl();

  await send({
    to: user.email,
    subject: 'Did you spend any cash today? 💸',
    text: `Hi ${user.name}, quick reminder to log today's cash spending on CrediScope: ${link}. Current streak: ${user.streak?.current || 0} days.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px">
        <h2 style="color:#1B2A22">Did you spend any cash today?</h2>
        <p>Hi ${user.name}, this is your daily CrediScope reminder to log any cash expense before it slips your mind.</p>
        <p style="margin:24px 0">
          <a href="${link}" style="background:#B8862B;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold">
            Log it on CrediScope
          </a>
        </p>
        <p style="color:#666;font-size:13px">Current streak: ${user.streak?.current || 0} day(s). Keep it going!</p>
      </div>
    `
  });
};