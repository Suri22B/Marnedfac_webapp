import nodemailer from 'nodemailer';
// Configure Nodemailer
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});
