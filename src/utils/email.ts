import { createTransport, type Transporter } from "nodemailer";
import ejs from "ejs";
import fs from "fs";

type TemplateParams = {
  name: "inquiry";
  params: {
    fullname: string,
    company: string,
    email: string,
    message: string
  }
};

type SendEmailOptions = {
  to: string;
  subject: string;
  template: TemplateParams;
};

export async function sendEmail(options: SendEmailOptions): Promise<Transporter> {

  const transporter = await getEmailTransporter();
  return new Promise(async (resolve, reject) => {
    const { to, subject, template } = options;
    const html = await parseEmailTemplate(template.name, template.params);
    const from = import.meta.env.SEND_EMAIL_FROM;
    const message = { to, subject, html, from };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      }

      console.log("Message sent:", info.messageId);
      resolve(info);
    });
  });
}

async function getEmailTransporter(): Promise<Transporter> {
  return new Promise((resolve, reject) => {
    if (!import.meta.env.RESEND_API_KEY) {
      throw new Error("Missing Resend configuration");
    }

    const transporter = createTransport({
      host: "smtp.resend.com",
      secure: true,
      port: 465,
      auth: { user: "resend", pass: import.meta.env.RESEND_API_KEY },
    });
    resolve(transporter);
  });
}

async function parseEmailTemplate(name: TemplateParams["name"], params: TemplateParams["params"]): Promise<string> {
  const rawTemplate = fs.readFileSync(`./src/utils/templates/${name}.ejs`, "utf8");
  return ejs.render(rawTemplate, params);
}