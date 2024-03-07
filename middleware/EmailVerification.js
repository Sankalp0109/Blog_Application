
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
let otp
const generateOTP = ()=> {
  return otpGenerator.generate(6, {
    digits: true,
    upperCase: false,
    specialChars: false
  });
};
const sendOTPEmail = async(email, otp)=> {
  const mailtrapConfig = {
    host: "live.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "api",
      pass: "3b9441dd5fe6b383a3e27c2771785490"
    }
  };
  const transporter = nodemailer.createTransport(mailtrapConfig);
  const mailOptions = {
    from: 'mailtrap@demomailtrap.com',
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
    //console.log(email);
    try{
    sendOTPEmail(email,OTP);
    otp = OTP;
    req.session.otp = OTP;
    console.log('OTP saved in session:', req.session.otp);
    }catch(error){
        console.log(error);
    }

}
const verifyOTP = (req,res,next)=>{
  if(req.body.otp != otp){
    req.flash('error','Wrong OTP');
    res.redirect('/signup');
  } else{
    next();
  }
}
module.exports = {
    sendOTP,
    verifyOTP,
}