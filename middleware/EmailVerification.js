
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

var otp ;
const mailFormat = (otp)=>{
  const body = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
  </head>
  
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  
      <h2 style="color: #333;">Your OTP Code</h2>
  
      <p style="font-size: 16px; color: #666;">Your One-Time Password (OTP) is:</p>
  
      <div style="background-color: #f9f9f9; padding: 10px; border-radius: 6px; font-size: 20px; color: #333; margin-bottom: 20px;">
        <strong>${otp}</strong>
      </div>
  
      <p style="font-size: 16px; color: #666;">Please use this OTP to proceed with your action.</p>
  
      <p style="font-size: 14px; color: #888;">This OTP is valid for a short period. Do not share it with anyone.</p>
  
      <hr style="border: 1px solid #ddd; margin: 20px 0;">
  
      <p style="font-size: 14px; color: #888;">If you didn't request this OTP, please ignore this email.</p>
  
    </div>
  
  </body>
  
  </html>`
  return body;
  
}
const generateOTP = ()=> {
  // return otpGenerator.generate(6, {
  //   digits: true,
  //   upperCase: false,
  //   specialChars: false
  // });
  return `${Math.floor(Math.random()*1000000)}`;
};
const sendOTP = (req,res,next)=>{
  const OTP = 1011;
  const email = req.body.email;
  //console.log(email);
  try{
  //sendOTPEmail(email,OTP);
  otp = OTP;
  req.session.otp = OTP;
  console.log('OTP saved in session:', req.session.otp);
  }catch(error){
      console.log(error);
  }

}
const sendOTPEmail = async(email, otp)=> {
  const mailtrapConfig = {
    host: "live.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "api",
      pass: process.env.MAIL_TRAP_PASSWORD,
    }
  };
  const transporter = nodemailer.createTransport(mailtrapConfig);
  const mailOptions = {
    from: 'mailtrap@demomailtrap.com',
    to: 'sankalpchaturvedi24@gmail.com',
    subject: 'Your OTP Code',
    html: mailFormat(otp),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}


const verifyOTP = (req,res,next)=>{
  console.log(req.session.otp);
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