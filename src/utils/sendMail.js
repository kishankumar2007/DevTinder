const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "9663f9001@smtp-brevo.com",
        pass: "GvjnTILyHBSRgzh0"
    }
});

const greetUser = async (firstName, email) => {
    try {
        const info = await transporter.sendMail({
            from: '"devTinder" <paytmcashly@gmail.com>',
            to: email,
            subject: "Welcome to DevTinder 🎉",
            html: `<h2>Welcome to DevTinder 🚀</h2>
                   <p>Hi <b>${firstName}</b>,</p>
                   <p>We’re excited to have you join our developer community! 🎉</p>
                   <p>Let’s start this journey and make coding fun! 😃</p>
                   <br/>
                   <p>Best Regards,<br/>Team DevTinder</p>`
        })
    } catch (error) {
        console.log(error.message)
    }
}

const sendOtp = async (email) => {
    try {
        const otp = generateOtp()
        const info = await transporter.sendMail({
            from: '"DevTinder" <paytmcashly@gmail.com>',
            to: email,
            subject: "Your DevTinder OTP",
            html: `
                <h2> Welcome to DevTinder 🚀</h2>
                <p>Hi <b>User</b>,</p>
                <p>Your one-time password (OTP) is: ${otp}</p>
                <h1 style="letter-spacing:5px;">${otp}</h1>
                <p>This code will expire in <b>5 minutes</b>.</p>
                <br/>
                <p>- Team DevTinder</p>
    `
        })
        return otp
    } catch (error) {
        console.log(error.message)
    }
}



const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000)
}


module.exports = { greetUser, sendOtp }