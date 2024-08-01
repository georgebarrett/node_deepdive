const nodemailer = require('nodemailer');

class Email {
    // the function that runs when a new object is created through this class
    // the user and url are the bits needed to send emails. eg welcome emails when a user signsup
    constructor(user, url) {
        this.to = user.email;
        // for personalising the email
        this.firstName = user.name.split(' ')[0];
        // equal to the incoming email
        this.url = url;
        this.from = `Aphex Twin ${process.env.EMAIL_FROM}`;
    }

    createTransport() {
        if (process.env.NODE_ENV === 'production') {
            // sendgrid
            return 1;
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD   
            }
        });
    }
}
const sendEmail = async (options) => {

    const mailOptions = {
        from: 'Aphex Twin <george@george.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// FOR GMAIL
    // const transporter = nodemailer.createTransport({
        // service: 'Gmail',
        // auth: {
            // user: process.env.EMAIL_USERNAME
            // password: process.env.EMAIL_PASSWORD   
        // }
    // })