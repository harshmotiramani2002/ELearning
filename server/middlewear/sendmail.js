import nodemailer from 'nodemailer';
const { createTransport } = nodemailer; 

const sendMail = async (email, subject, data) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.Gmail,
            pass: process.env.Password,
        }
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .otp {
            font-size: 28px;
            color: #7b68ee;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name}, your One-Time Password is:</p>
        <p class="otp">${data.otp}</p>
    </div>
</body>
</html>`;
    await transport.sendMail({
        from: process.env.Gmail,
        to: email,
        subject,
        html,
    });
};

export default sendMail;
