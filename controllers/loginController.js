const jwt = require("jsonwebtoken");
const { validateCode, authenticateAdmin, updatePassword } = require("../Services/loginService");
const nodemailer = require('nodemailer');
const generatePassword = require('generate-password');
const fs = require('fs');
const path = require('path');

// Constructing the path to the email template
const emailTemplatePath = path.join(__dirname, 'email_templates', 'index.html');

// Read the HTML template file
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');


async function validate(req, res) {
  try {
    const result = await validateCode(req.body);

    if (result.length > 0) {
      const pin_code = req.body.pin_code;

      const jwtToken = jwt.sign({ pin_code }, process.env.CLIENT_SECRET, {
        expiresIn: "1h",
      });

      res
        .status(200)
        .json({
          message: "Authorized successfully",
          data: result,
          token:btoa(jwtToken),
        });
    } else {
      res.status(401).json({ message: "Invalid Credentials." });
    }
  } catch (err) {
    console.error("Error validating:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function loginAdmin(req, res) {
  try {
    const result = await authenticateAdmin(req.body);

    if (result.length > 0) {
      const jwtToken = jwt.sign(
        { email: req.body.email },
        process.env.CLIENT_SECRET,
        { expiresIn: "1h" }
      );

      res
        .status(200)
        .json({
          message: "Authorized successfully",
          data: result,
          token: btoa(jwtToken),
        });
    } else {
      res
        .status(401)
        .json({ message: "Unauthorized", data: result });
    }
  } catch (err) {
    console.error("Error validating:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

 async function sendForgetPasswordMail(req,res) {

  const password = generatePassword.generate({
    length: 12,  // Password length
    numbers: true,  // Include numbers
    symbols: true,  // Include symbols
    uppercase: true,  // Include uppercase letters
    lowercase: true,  // Include lowercase letters
    excludeSimilarCharacters: true,  // Exclude similar characters (e.g., 'i', 'l', '1', 'O', '0')
});
  const MAIL_SETTINGS = {
    service: "gmail",
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASS_KEY,
    },
  };

  

  const transporter = nodemailer.createTransport(MAIL_SETTINGS);

  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: "devsalmanst@gmail.com",
      subject: "New Admin Password for ScanQuest",
      html:`
      <div class="parent" style="width: 100vw; 
      height: 100vh;
       position: fixed; 
       background: url(https://img.freepik.com/free-photo/workplace-with-smartphone-laptop-black-table-top-view-copyspace-background_144627-24860.jpg?w=740&t=st=1703358526~exp=1703359126~hmac=0d989a95bbd0ce0fcf9577842d24069cc8483c2789e7af228c61b64740d5281e); 
       background-repeat: no-repeat;
        background-position: center;
         background-size: cover;"
          >
          <div style="
          
          background: white;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 20px;" class="child">
              <div class="logo" style="margin: auto;
            
              margin-top: 30px;">
                  <img src="./Imgaes/SQ.png" alt="" style="width: 100%;">
                  <p style="font-size: 73%;">SCAN QUEST</p>
              </div>
              <hr style="width: 68%;
              margin: auto;
              margin-top: 20px;">
              <h2 style="text-align: center;
                  font-size: 125%;
                  margin-top: 10px;
              color: #FF8A00;" class="p_r">Password Reset Request</h2>
              <div style="width: 68%;
              margin: auto;" class="info">
                  <p style="font-size: 110%;
                  margin-top: 10px;" class="p_one">Dear Admin,</p>
                  <p style="font-size: 80%;
                  margin-top: 10px;" class="p_two">We received a password reset request from the admin panel for your
                      account. We're
                      pleased to inform you that your password has been successfully updated, and the new login details
                      have been sent to your registered email address.</p>
                  <p style="font-size: 120%;
                  text-align: center;
                  margin-top: 20px;
                  font-weight: bold;" class="code">jKp5qR8sT2xW6zY1</p>
              </div>
              <div style="width: 68%;
              margin: auto;
              margin-top: 20px;
              padding-right: 10px;" class="info_end">
                  <p style="font-size: 90%;" class="p_three">To access the admin panel and log in with your updated
                      credentials, click the button
                      below:</p>
              </div>
              <div style="margin: auto;
              width: 26%;
              height: 42px;
              margin-top: 20px;" class="login">
                  <img src="./Imgaes/login-button.png" alt="" style="width: 100%;">
              </div>
              <hr style="width: 68%;
              margin: auto;
              margin-top: 20px;">
              <div style="margin: auto;
              width: 68%;
              margin-top: 20px;" class="end">
                  <p style="font-size: 120%;
                  font-weight: bold;" class="scan_q">Scan Quest</p>
                  <p style="font-size: 80%;" class="mail">scanquest@gmail.com</p>
              </div>
          </div>
      </div>
      `
    });
  
  const result= await updatePassword(password)

    res
    .status(200)
    .json({
      message: "Email sent successfully. Check your inbox for new password",
  
    });
  } catch (error) {
    console.log(error)
    return res.status(500);
  }
}


module.exports = { validate, loginAdmin, sendForgetPasswordMail };
