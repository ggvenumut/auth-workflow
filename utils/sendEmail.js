import nodemailer from "nodemailer";
import nodemailerConfig from "./nodemailerConfig.js";

const sendMail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: "Sender Name <sender@example.com>",
    to,
    subject,
    html,
  });
};
export default sendMail;
