import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: "xsmtpsib-450b7d18f4addfa8aa0cd8ed140b44a2bdd172d47fbb7e260d7a8b9ac17ac3a8-L7rspVchwdGCNRaJ",
  },
})

export default transporter