import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();
import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined
  });

  return transporter;
};

const clientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

const send = async ({ to, subject, html, text }) => {
  // If SMTP isn't configured, don't crash the app - just log so local dev keeps working.
  if (!process.env.SMTP_HOST) {
    console.log(`[email:skipped - no SMTP_HOST set] to=${to} subject="${subject}"`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || 'CrediScope <no-reply@crediscope.app>',
    to,
    subject,
    html,
    text
  });
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
give full code to cahngeShow moreReconstructed email module with timeout fixes and error handlingReconstructed email module with timeout fixes and error handlingHere's your file with the IPv4 fix plus the timeout/error-handling from before, all together — copy this entire block into backend/src/services/email.service.js, replacing everything:Confirm the sandbox copy (with all fixes) is valid before sharingConfirm the sandbox copy (with all fixes) is valid before sharingjavascriptimport nodemailer from 'nodemailer';

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
    connectionTimeout: 8000, // fail fast instead of hanging if the SMTP server doesn't respond
    greetingTimeout: 8000,
    socketTimeout: 8000
  });

  return transporter;
};

const clientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

const send = async ({ to, subject, html, text }) => {
  // If SMTP isn't configured, don't crash the app - just log so local dev keeps working.
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
    // Log and swallow: a slow/broken SMTP connection should never hang
    // or crash the request that triggered this email.
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
Two changes from your version: family: 4 (forces IPv4, fixing the ENETUNREACH error you hit), and the three timeout lines plus a try/catch around the actual send so a slow/failed connection can't hang your signup/reset requests again. Everything else — function names, exports, HTML templates — is untouched.
powershellgit add .
git commit -m "Force IPv4 for SMTP + add timeouts"
git push
Wait for Render to redeploy, then try the reset link again.again something went wrongInvestigated diagnostic methods to pinpoint underlying error causeInvestigated diagnostic methods to pinpoint underlying error causeLet's find the actual error again — same process as before. Two things:
1. Render logs (Live tail), try "resend link" while watching it
Look for one of:

[email:failed] ... <error message> — the SMTP fix didn't work, and this error message tells us why
Nothing at all — request isn't reaching the resend endpoint
Some other server error (500) unrelated to email

2. Browser Network tab
Inspect → Network → try resend again → click the failed request → tell me:

Status code
Response tab contents

Also worth double-checking: did the Render deploy from your last push actually finish and show "Live" in the Events tab? If it's still building, or if it failed, you'd still be running the old code without the IPv4 fix.
Paste whichever you get first — the Render log line is usually the fastest way to pinpoint it exactly.main.0a10db71.css    304    stylesheet    Other    0.1 kB    386 ms
forgot-password    CORS error    xhr    ForgotPassword.jsx:19    0.0 kB    198 ms
forgot-password    204    preflight    Preflight
0.0 kB    191 msInvestigated CORS middleware behavior and deployment configuration issuesInvestigated CORS middleware behavior and deployment configuration issuesThis is a genuine CORS error again, but only on forgot-password — that's an important clue. Since register worked earlier (after we fixed CLIENT_URL), and CORS is applied globally in app.js for every route, this being CORS-specific to just this one route usually means: the server is crashing or hanging partway through this request, so it never gets to send back the CORS headers — and the browser reports that as a CORS error even though the real cause is a backend error.
Let's confirm with Render logs — this is the fastest way to know for sure.
1. Open Render → Logs (Live tail)
2. Try "forgot password" again while watching it
3. Tell me what appears. Specifically look for:

[email:failed] ... <error message> — means it reached the email step and failed again (maybe still IPv6 somewhere, or a different SMTP error now)
Nothing at all appears in the logs — means the request isn't reaching Render (double check the forgot-password route path matches — is it /api/auth/forgot-password? Check the Network tab's Request URL again)
A crash/stack trace — means an unhandled error, likely inside the forgotPassword controller itself

4. Also confirm: in Render's Events tab, is the latest deploy (from your last push with the family: 4 fix) showing Live, with a timestamp after you pushed? If it's still on an older deploy, the IPv6 fix isn't even running yet.
Paste the Render log output from step 1–3 — that'll tell us definitively whether this is still the email timeout, or something new.[imit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/](https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/) for more information.
    at Object.xForwardedForHeader (file:///opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.mjs:352:13)
    at wrappedValidations.<computed> [as xForwardedForHeader] (file:///opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.mjs:675:22)
    at Object.keyGenerator (file:///opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.mjs:782:20)
    at file:///opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.mjs:864:32
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async file:///opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.mjs:825:5 {
  code: 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR',
  help: 'https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/'
}
POST /api/auth/refresh 401 3.475 ms - 35
POST /api/auth/refresh 401 0.687 ms - 35Show moreDiagnosed proxy configuration issue causing rate limiter middleware failureDiagnosed proxy configuration issue causing rate limiter middleware failureFound it — this is a well-known issue on Render (and Heroku, Railway, etc.). Render sits behind a proxy and adds an X-Forwarded-For header to every request. Express's req.ip doesn't know to trust that header unless you explicitly tell it to, so express-rate-limit throws this error and crashes the request before it can respond — which is exactly why the browser saw it as a CORS failure (the response never got sent).
The fix is one line in app.js: tell Express to trust Render's proxy.Trust Render's reverse proxy so express-rate-limit can read X-Forwarded-For safelyTrust Render's reverse proxy so express-rate-limit can read X-Forwarded-For safelyIn your local backend/src/app.js, find this near the top:
javascriptconst app = express();

app.use(helmet());
app.set('trust proxy', 1);
app.use(helmet());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'CrediScope' }));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
