const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
    // the function that runs when a new object is created through this class
    // the user and url are the bits needed to send emails. eg welcome emails when a user signs up
    constructor(user, url) {
        this.to = user.email;
        // for personalising the email
        this.firstName = user.name.split(' ')[0];
        // equal to the incoming email url
        this.url = url;
        this.from = `Aphex Twin ${process.env.EMAIL_FROM}`;
    }

    // different transports for different environements
    newTransport() {
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

    async send(template, subject) {
        // render HTML
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject: subject
        });

        // define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            // extracting content out of the html
            text: htmlToText.fromString(html)
        }

        // create a transport and ability to send email (does not actually send the email)
        await this.newTransport().transporter.sendMail(mailOptions);
    }

    async sendWelcome() {
        // 'welcome will be passed into 'template' and then grab the file from above
        await this.send('welcome', 'Welcome to the cult!');
    }
}




// FOR GMAIL
    // const transporter = nodemailer.createTransport({
        // service: 'Gmail',
        // auth: {
            // user: process.env.EMAIL_USERNAME
            // password: process.env.EMAIL_PASSWORD   
        // }
    // })