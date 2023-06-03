const nodemailer = require("nodemailer")

async function sendEmail(options) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} ${process.env.FROM_EMAIL}`,
    to: options.email,
    text: options.text,
    html: options.html,
  })
  console.log("Message sent: %s", info.messageId)
}

module.exports = sendEmail
