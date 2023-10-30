const AWS = require("aws-sdk")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")

const config = {
  region: "us-east-1",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
}

const AWS_SES = new AWS.SES(config)

const getEmailHtml = ({ template, args }) => {
  const layout = fs.readFileSync(
    path.resolve(__dirname, "../templates/email/layout.hbs")
  )
  const content = fs.readFileSync(
    path.resolve(__dirname, `../templates/email/${template}`)
  )
  handlebars.registerPartial("layout", layout.toString())
  return handlebars.compile(content.toString())(args)
}

const EmailService = {
  async sendWelcomeEmail({ email }) {
    const html = getEmailHtml({ template: "welcome.hbs" })
    const command = {
      Destination: { ToAddresses: [email] },
      Source: process.env.AWS_SES_SENDER,
      Message: {
        Subject: { Data: "Welcome to Zuraaya" },
        Body: {
          Html: { Data: html },
        },
      },
    }
    await AWS_SES.sendEmail(command).promise()
  },
  async forgotPassword({ email, link }) {
    const html = getEmailHtml({
      template: "forgot-password.hbs",
      args: { email, link },
    })
    const command = {
      Destination: { ToAddresses: [email] },
      Source: process.env.AWS_SES_SENDER,
      Message: {
        Subject: { Data: "Password Reset" },
        Body: {
          Html: { Data: html },
        },
      },
    }
    await AWS_SES.sendEmail(command).promise()
  },
  async placeOrder({ order }) {
    const html = getEmailHtml({
      template: "place-order.hbs",
      args: { order },
    })
    const command = {
      Destination: { ToAddresses: [order?.user?.email] },
      Source: process.env.AWS_SES_SENDER,
      Message: {
        Subject: { Data: "Confirmation of Your Order" },
        Body: {
          Html: { Data: html },
        },
      },
    }
    await AWS_SES.sendEmail(command).promise()
  },
  async orderStatus({ order }) {
    const html = getEmailHtml({
      template: "order-status.hbs",
      args: { order },
    })
    const command = {
      Destination: { ToAddresses: [order?.user?.email] },
      Source: process.env.AWS_SES_SENDER,
      Message: {
        Subject: { Data: "Status of Your Order" },
        Body: {
          Html: { Data: html },
        },
      },
    }
    await AWS_SES.sendEmail(command).promise()
  },
  async sendVerificationEmail({ email, name, otp }) {
    const html = getEmailHtml({
      template: "email-verification.hbs",
      args: { name, otp },
    })
    const command = {
      Destination: { ToAddresses: [email] },
      Source: `Zuraaya <noreply@zuraaya.com>`,
      Message: {
        Subject: { Data: "Verify your email address" },
        Body: {
          Html: { Data: html },
        },
      },
    }
    await AWS.SES.sendEmail(command).promice()
  },
  async sendNewsletterVerificationEmail({ name, email, link }) {
    const html = getEmailHtml({
      template: "newsletter-subscription-verification.hbs",
      args: { name, email, link },
    })
    const command = {
      Destination: { ToAddresses: [email] },
      Source: `Zuraaya <noreply@zuraaya.com>`,
      Message: {
        Subject: { Data: "Confirm your subscription" },
        Body: {
          Html: { Data: html },
        },
      },
    }
    await AWS.SES.sendEmail(command).promise()
  },
}

module.exports = EmailService
