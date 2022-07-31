import nodemailer from "nodemailer";

const sendMail = async () => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "tiara49@ethereal.email",
      pass: "rqw8aUU9Hq5MpGsfkE",
    },
  });

  let message = await transporter.sendMail({
    from: "Sender Name <sender@example.com>",
    to: "Recipient <recipient@example.com>",
    subject: "Nodemailer is unicode friendly ✔",
    text: "Hello to myself!",
    html: "<p><b>Hello</b> to myself!</p>",
  });
};
export default sendMail;
