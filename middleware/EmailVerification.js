
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const generateOTP = ()=> {
  return otpGenerator.generate(6, {
    digits: true,
    upperCase: false,
    specialChars: false
  });
};
const sendOTPEmail = async(email, otp)=> {
  const mailtrapConfig = {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4ad9e9187cf2d4",
      pass: "4d8d3ae4830d5e"
    }
  };
  const transporter = nodemailer.createTransport(mailtrapConfig);
  const mailOptions = {
    from: 'your-email@example.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP (One-Time Password) is: ${otp}`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}
const sendOTP = (req,res,next)=>{
    const OTP = generateOTP();
    const email = req.body.email;
    try{
    sendOTPEmail(email,OTP);
    res.redirect('/OTP');
    }catch(error){
        console.log(error);
    }

}
module.exports = {
    sendOTP,
}