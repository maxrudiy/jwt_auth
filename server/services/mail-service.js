import nodemailer from "nodemailer";

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  async sendActivationMail(email, activationUrl) {
    return await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Activation URL",
      text: "Activation URL",
      html: `<a href=${activationUrl}>Activation URL</a>`,
    });
  }
}

export default new MailService();
