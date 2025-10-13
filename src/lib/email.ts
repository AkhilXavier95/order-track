import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

async function createTransporter() {
  if (transporter) return transporter;

  if (process.env.NODE_ENV === "production") {
    // Production: use real SMTP from env
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new Error("SMTP environment variables are missing!");
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development: use Ethereal
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log(
      "Ethereal test account created. Check emails at:",
      testAccount.web
    );
  }

  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const transport = await createTransporter();

  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM || '"Dev App" <no-reply@example.com>',
    to,
    subject,
    html
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}
