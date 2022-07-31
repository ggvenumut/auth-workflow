import sendMail from "./sendEmail.js";

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link : <a href="${verifyEmail}">Verify email</a></p>`;

  return sendMail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${name} </h4> 
           ${message}
    `,
  });
};

export default sendVerificationEmail;
