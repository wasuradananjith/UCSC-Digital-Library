const nodemailer = require('nodemailer');

const transporter = module.exports = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aweerateamscorp2@gmail.com',
        pass: 'aweera123'
    }
});

