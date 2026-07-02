import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: process.env.SMTP_SECURE !== 'false', // true for 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendOrgInvite(opts: {
        to: string;
        orgName: string;
        invitedBy: string;
        inviteLink: string;
    }) {
        const { to, orgName, invitedBy, inviteLink } = opts;
        const from = process.env.SMTP_FROM || 'SprintTrekker <no-reply@sprinttrekker.com>';

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You've been invited</title>
  <style>
    body { margin: 0; padding: 0; background: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; }
    .wrapper { max-width: 560px; margin: 40px auto; padding: 0 16px; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 40px; }
    .logo { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 32px; letter-spacing: -0.5px; }
    .logo span { background: linear-gradient(135deg, #7c3aed, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    h1 { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 12px; }
    p { font-size: 15px; line-height: 1.7; color: #a1a1aa; margin: 0 0 24px; }
    .org-chip { display: inline-block; background: #27272a; border: 1px solid #3f3f46; border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 32px; }
    .btn { display: inline-block; background: #fff; color: #09090b; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none; }
    .hint { font-size: 13px; color: #71717a; margin-top: 32px; padding-top: 24px; border-top: 1px solid #27272a; }
    .link-text { color: #7c3aed; word-break: break-all; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">Sprint<span>Trekker</span></div>
      <h1>You've been invited! 🎉</h1>
      <p><strong style="color:#fff">${invitedBy}</strong> has invited you to join their organization on SprintTrekker.</p>
      <div class="org-chip">🏢 ${orgName}</div>
      <br/>
      <a href="${inviteLink}" class="btn">Accept Invitation</a>
      <div class="hint">
        <p>This link expires in <strong style="color:#e4e4e7">72 hours</strong>. If you don't have a SprintTrekker account yet, you'll be asked to sign up first.</p>
        <p>Or copy &amp; paste this URL into your browser:<br/><span class="link-text">${inviteLink}</span></p>
      </div>
    </div>
  </div>
</body>
</html>`;

        try {
            await this.transporter.sendMail({
                from,
                to,
                subject: `${invitedBy} invited you to join "${orgName}" on SprintTrekker`,
                html,
            });
            this.logger.log(`Invite email sent to ${to}`);
        } catch (err: any) {
            this.logger.error(`Failed to send invite email to ${to}: ${err.message}`);
            throw err;
        }
    }
}
