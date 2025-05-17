import nodemailer from "nodemailer";
const EMAIL = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user:EMAIL,
         pass:process.env.EMAIL_PASS,
    },
});
const sendverificationEmail = async(
    fullName,
    email,
    otp,
)=>{
    await transporter .sendMail({
        from:`pooja <${EMAIL}>`,
        to : email,
        subject :"verify your email address",
        html : `<h1>welcome,${fullName}</h1></br><h2>${otp}</h2>`
    });
};

 export default sendverificationEmail;
