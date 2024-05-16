const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "linhtran.it.3004@gmail.com",
        pass: "qenz nawe apld knkk",
      },
    });

    const mailOptions = {
      from: "linhtran.it.3004@gmail.com",
      to,
      subject,
      text,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

module.exports = sendEmail;