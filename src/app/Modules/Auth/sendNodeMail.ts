import nodemailer from "nodemailer";
import config from "../../config";

const nodeMailerEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.gmail,
      pass: config.gmail_secret,
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: '"Ph-Doctor👻" <mdgolammorshed0099@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Reset Password link", // Subject line
      //   text: "Hello world?", // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
};

export default nodeMailerEmail 