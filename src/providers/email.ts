import nodemailer from 'nodemailer';
import { noReplyEmailAddress, receiverEmailAddress, siteurl, smtpHostname, smtpPassword } from "../config/config";

export class EmailProvider {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: smtpHostname,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: receiverEmailAddress,
        pass: smtpPassword,
      },
      logger: true,
    });
  }

  public async sendEmail(from: string, to: string | string[], subject: string, text: string, html?: string) {
    await this.transporter.sendMail({
      from,
      to,
      subject: subject,
      text: text,
      html: html,
      headers: { 'x-myheader': 'test header' },
    });
  }

  public async emailPasswordResetLink(email: string, hash: string, resetToken: string) {
    const subject = `Casion App Password Reset Link`;
    let content = `<p>Please, use the following link to reset your password:</p>`;
    content += `<br><a href="${siteurl}/reset-password/${hash}/${resetToken}" target="_blank"><h2>RESET MY PASSWORD</h2></a>`;
    return this.sendEmail(noReplyEmailAddress, email, subject, content);
  }
}
