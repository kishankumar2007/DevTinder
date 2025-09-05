const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: "paytmcashly@gmail.com",
        pass: "farqrdevuizjevug"
    }
})

const greetUser = async (firstName, email ) => {
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
        const Otp = generateOtp()
        const info = await transporter.sendMail({
            from: '"DevTinder" <paytmcashly@gmail.com>',
            to: email,
            subject: "Your DevTinder OTP",
            html: `
                <h2> Welcome to DevTinder 🚀</h2>
                <p>Hi <b>User</b>,</p>
                <p>Your one-time password (OTP) is: ${Otp}</p>
                <h1 style="letter-spacing:5px;">${Otp}</h1>
                <p>This code will expire in <b>5 minutes</b>.</p>
                <br/>
                <p>- Team DevTinder</p>
    `
        })
        return Otp
    } catch (error) {
        console.log(error.message)
    }
}



const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000)
}


module.exports = { greetUser, sendOtp }