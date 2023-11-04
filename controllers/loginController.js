const jwt = require("jsonwebtoken");
const { validateCode, authenticateAdmin, updatePassword } = require("../Services/loginService");
const nodemailer = require('nodemailer');
const generatePassword = require('generate-password');



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
      res.status(401).json({ message: "unauuthorized" });
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
      html: `
        <div class="container" style="max-width: 100vw; margin: auto; padding-top: 10px">
          <h1 style="font-size: 24px;">Hi 👋</h1>
          <p style="font-size: 16px; margin-top:15px;" > This is your new admin panel password: ${password} </p>
      </div>
      `,
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
