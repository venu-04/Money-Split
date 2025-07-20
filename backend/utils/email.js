import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // App password
  }
});
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("EMAIL credentials are missing. Check .env file.");
}


/**
 * Sends invitation email with a custom registration link
 * @param {string} toEmail - Email to invite
 * @param {string} inviterName - Who is inviting
 * @param {string} inviteLink - Link to include in the email
 */
const sendInviteEmail = async (toEmail, inviterName, inviteLink) => {
    console.log("TO Email:", toEmail);
    console.log("Inviter Name:", inviterName);
    console.log("Invite Link:", inviteLink);
    
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `${inviterName} invited you to join MoneySplit 💰`,
    html: `
      <p>Hi there!</p>
      <p><strong>${inviterName}</strong> invited you to join <b>MoneySplit</b> to manage shared expenses easily.</p>
      <p><a href="${inviteLink}" target="_blank" style="padding:10px 20px; background-color:#4CAF50; color:white; text-decoration:none;">Join Now</a></p>
      <p>If the button doesn't work, open this link: <br/>${inviteLink}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendInviteEmail;
