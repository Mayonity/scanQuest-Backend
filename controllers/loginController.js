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
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Scan Quest</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Caveat&family=Josefin+Sans&family=Lato&family=Poppins&family=Roboto&display=swap');
      
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: 'Poppins', sans-serif;
              }
      
              .parent {
                  width: 100vw;
                  height: 100vh;
                  position: relative;
                  background-image: url(./Imgaes/main-bg.png);
                  background-repeat: no-repeat;
                  background-position: center;
                  background-size: cover;
              }
      
              .child {
                  width: 55vw;
                  height: 83vh;
                  background: white;
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  border-radius: 20px;
              }
      
              .logo {
                  margin: auto;
                  width: 12%;
                  margin-top: 30px;
              }
      
              .logo img {
                  width: 100%;
              }
      
              .logo p {
                  font-size: 90%;
              }
      
              hr {
                  width: 68%;
                  margin: auto;
                  margin-top: 20px;
              }
      
              .p_r {
                  text-align: center;
                  font-size: 145%;
                  margin-top: 10px;
                  color: #FF8A00;
              }
      
              .info {
                  width: 68%;
                  margin: auto;
              }
      
              .p_one {
                  font-size: 80%;
                  margin-top: 10px;
              }
      
              .p_two {
                  font-size: 90%;
                  margin-top: 10px;
              }
      
              .code {
                  font-size: 120%;
                  text-align: center;
                  margin-top: 20px;
                  font-weight: bold;
      
              }
      
              .info_end {
                  width: 68%;
                  margin: auto;
                  margin-top: 20px;
                  padding-right: 10px;
              }
      
              .p_three {
                  font-size: 90%;
              }
      
              .login {
                  margin: auto;
                  width: 26%;
                  height: 42px;
                  margin-top: 20px;
              }
      
              .login img {
                  width: 100%;
              }
      
              .end {
                  margin: auto;
                  width: 68%;
                  margin-top: 20px;
              }
      
              .scan_q {
                  font-size: 120%;
                  font-weight: bold;
              }
      
              .mail {
                  font-size: 80%;
              }
      
              @media (max-width:1920px) {
                  .child {
                      width: 55vw;
                      height: 750px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 12%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 120%;
                  }
      
                  hr {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 155%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 68%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 110%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 120%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 180%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 122%;
                  }
      
                  .login {
                      margin: auto;
                      width: 26%;
                      height: 47px;
                      margin-top: 30px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 68%;
                      margin-top: 20px;
                  }
      
                  .scan_q {
                      font-size: 160%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 120%;
                  }
              }
      
              @media (max-width:1440px) {
                  .child {
                      width: 55vw;
                      height: 620px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 12%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 90%;
                  }
      
                  hr {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 145%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 68%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 80%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 90%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 120%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 90%;
                  }
      
                  .login {
                      margin: auto;
                      width: 26%;
                      height: 42px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 68%;
                      margin-top: 20px;
                  }
      
                  .scan_q {
                      font-size: 120%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 80%;
                  }
              }
      
              @media (max-width:1366px) {
                  .child {
                      width: 52vw;
                      height: 520px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 11%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 77%;
                  }
      
                  hr {
                      width: 60%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 125%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 61%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 80%;
                      margin-top: 5px;
                  }
      
                  .p_two {
                      font-size: 77%;
                      margin-top: 5px;
                  }
      
                  .code {
                      font-size: 100%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 61%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 77%;
                  }
      
                  .login {
                      margin: auto;
                      width: 22%;
                      height: 36px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 61%;
                      margin-top: 5px;
                  }
      
                  .scan_q {
                      font-size: 90%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 77%;
                  }
              }
      
              @media (max-width:1320psx) {
                  .child {
                      width: 52vw;
                      height: 520px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 11%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 70%;
                  }
      
                  hr {
                      width: 60%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 125%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 61%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 80%;
                      margin-top: 5px;
                  }
      
                  .p_two {
                      font-size: 77%;
                      margin-top: 5px;
                  }
      
                  .code {
                      font-size: 100%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 61%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 77%;
                  }
      
                  .login {
                      margin: auto;
                      width: 22%;
                      height: 36px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 61%;
                      margin-top: 5px;
                  }
      
                  .scan_q {
                      font-size: 90%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 77%;
                  }
              }
      
              @media (max-width:1280px) {
                  .child {
                      width: 55vw;
                      height: 570px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 12%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 80%;
                  }
      
                  hr {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 145%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 68%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 80%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 80%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 120%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 80%;
                  }
      
                  .login {
                      margin: auto;
                      width: 26%;
                      height: 42px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 68%;
                      margin-top: 20px;
                  }
      
                  .scan_q {
                      font-size: 120%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 80%;
                  }
              }
      
              @media (max-width:1213px) {
                  .child {
                      width: 55vw;
                      height: 570px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 12%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 75%;
                  }
      
                  hr {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 130%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 68%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 75%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 115%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 75%;
                  }
      
                  .login {
                      margin: auto;
                      width: 26%;
                      height: 42px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 68%;
                      margin-top: 20px;
                  }
      
                  .scan_q {
                      font-size: 110%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 78%;
                  }
              }
      
              @media (max-width:1107px) {
                  .child {
                      width: 55vw;
                      height: 540px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 12%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 70%;
                  }
      
                  hr {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 130%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 68%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 68%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 105%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 68%;
                  }
      
                  .login {
                      margin: auto;
                      width: 26%;
                      height: 42px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 68%;
                      margin-top: 20px;
                  }
      
                  .scan_q {
                      font-size: 100%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 72%;
                  }
              }
      
              @media (max-width:1024px) {
                  .child {
                      width: 55vw;
                      height: 500px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 12%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 65%;
                  }
      
                  hr {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 120%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 68%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 62%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 60%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 90%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 62%;
                  }
      
                  .login {
                      margin: auto;
                      width: 26%;
                      height: 42px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 68%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 100%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 72%;
                  }
              }
      
              @media (max-width:941px) {
                  .child {
                      width: 55vw;
                      height: 500px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 12%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 56%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 100%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 57%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 59%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 86%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 58%;
                  }
      
                  .login {
                      margin: auto;
                      width: 26%;
                      height: 42px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 90%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 65%;
                  }
              }
      
              @media (max-width:839px) {
                  .child {
                      width: 55vw;
                      height: 500px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 12%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 52%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 100%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 53%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 54%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 86%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                      padding-right: 10px;
                  }
      
                  .p_three {
                      font-size: 53%;
                  }
      
                  .login {
                      margin: auto;
                      width: 26%;
                      height: 42px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 90%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 65%;
                  }
              }
      
              @media (max-width:768px) {
                  .child {
                      width: 65vw;
                      height: 530px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 15%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 71%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 120%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 106%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 71%;
                  }
      
                  .login {
                      margin: auto;
                      width: 32%;
                      height: 40px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 100%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 70%;
                  }
              }
      
              @media (max-width:676px) {
                  .child {
                      width: 65vw;
                      height: 530px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 15%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 64%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 120%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 106%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 71%;
                  }
      
                  .login {
                      margin: auto;
                      width: 32%;
                      height: 40px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 100%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 70%;
                  }
              }
      
              @media (max-width:635px) {
                  .child {
                      width: 65vw;
                      height: 530px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 15%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 55%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 120%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 106%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 71%;
                  }
      
                  .login {
                      margin: auto;
                      width: 32%;
                      height: 30px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 100%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 70%;
                  }
              }
      
              
              @media (max-width:550px) {
                  .child {
                      width: 75vw;
                      height: 530px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 15%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 57%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 120%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 96%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 71%;
                  }
      
                  .login {
                      margin: auto;
                      width: 32%;
                      height: 40px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 100%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 70%;
                  }
              } 
      
              @media (max-width:525px) {
                  .child {
                      width: 75vw;
                      height: 550px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 15%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 57%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 110%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 96%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 71%;
                  }
      
                  .login {
                      margin: auto;
                      width: 32%;
                      height: 40px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 100%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 70%;
                  }
              }
      
              @media (max-width:485px) {
                  .child {
                      width: 75vw;
                      height: 520px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 15%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 51%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 100%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 65%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 86%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 67%;
                  }
      
                  .login {
                      margin: auto;
                      width: 32%;
                      height: 25px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 90%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 60%;
                  }
              }
      
              @media (max-width:426px) {
                  .parent {
                      background: url(./Imgaes/bg-for-mobile.png);
                  }
                  .child {
                      width: 75vw;
                      height: 520px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 15%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 46%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 90%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 70%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 65%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 78%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 67%;
                  }
      
                  .login {
                      margin: auto;
                      width: 32%;
                      height: 25px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 90%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 60%;
                  }
              }
      
              @media (max-width:414px) {
                  .parent {
                      background: url(./Imgaes/bg-for-mobile.png);
                  }
                  .child {
                      width: 90vw;
                      height: 600px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 22%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 60%;
                  }
      
                  hr {
                      width: 69%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 100%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 75%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 75%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 108%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 75%;
                  }
      
                  .login {
                      margin: auto;
                      width: 40%;
                      height: 32px;
                      margin-top: 20px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 20px;
                  }
      
                  .scan_q {
                      font-size: 97%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 70%;
                  }
              }
      
              @media (max-width:393px) {
                  .child {
                      width: 95vw;
                      height: 670px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 25%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 86%;
                  }
      
                  hr {
                      width: 75%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 120%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 85%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 85%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 128%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 87%;
                  }
      
                  .login {
                      margin: auto;
                      width: 52%;
                      height: 32px;
                      margin-top: 30px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 100%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 75%;
                  }
              }
      
              @media (max-width:375px) {
                  .child {
                      width: 95vw;
                      height: 620px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 20%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 66%;
                  }
      
                  hr {
                      width: 75%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 105%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 116%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 79%;
                  }
      
                  .login {
                      margin: auto;
                      width: 52%;
                      height: 32px;
                      margin-top: 30px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 110%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 79%;
                  }
              }
      
              @media (max-width:347px) {
                  .child {
                      width: 95vw;
                      height: 640px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 20%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 62%;
                  }
      
                  hr {
                      width: 75%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 105%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 116%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 79%;
                  }
      
                  .login {
                      margin: auto;
                      width: 52%;
                      height: 32px;
                      margin-top: 30px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 110%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 79%;
                  }
              }
      
              @media (max-width:320px) {
                  .child {
                      width: 95vw;
                      height: 640px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 20%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 56%;
                  }
      
                  hr {
                      width: 75%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 105%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 116%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 79%;
                  }
      
                  .login {
                      margin: auto;
                      width: 52%;
                      height: 32px;
                      margin-top: 30px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 110%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 79%;
                  }
              }
      
              @media (max-width:290px) {
                  .child {
                      width: 95vw;
                      height: 640px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 20%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 51%;
                  }
      
                  hr {
                      width: 75%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 105%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 116%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 79%;
                  }
      
                  .login {
                      margin: auto;
                      width: 52%;
                      height: 32px;
                      margin-top: 30px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 110%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 79%;
                  }
              }
      
              @media (max-width:280px) {
                  .child {
                      width: 99vw;
                      height: 660px;
                      background: white;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      border-radius: 20px;
                  }
      
                  .logo {
                      margin: auto;
                      width: 20%;
                      margin-top: 30px;
                  }
      
                  .logo img {
                      width: 100%;
                  }
      
                  .logo p {
                      font-size: 51%;
                  }
      
                  hr {
                      width: 75%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_r {
                      text-align: center;
                      font-size: 105%;
                      margin-top: 10px;
                  }
      
                  .info {
                      width: 69%;
                      margin: auto;
                  }
      
                  .p_one {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .p_two {
                      font-size: 79%;
                      margin-top: 10px;
                  }
      
                  .code {
                      font-size: 116%;
                      text-align: center;
                      margin-top: 20px;
                      font-weight: bold;
      
                  }
      
                  .info_end {
                      width: 68%;
                      margin: auto;
                      margin-top: 20px;
                  }
      
                  .p_three {
                      font-size: 79%;
                  }
      
                  .login {
                      margin: auto;
                      width: 52%;
                      height: 32px;
                      margin-top: 30px;
                  }
      
                  .login img {
                      width: 100%;
                      height: 100%;
                  }
      
                  .end {
                      margin: auto;
                      width: 69%;
                      margin-top: 10px;
                  }
      
                  .scan_q {
                      font-size: 110%;
                      font-weight: bold;
                  }
      
                  .mail {
                      font-size: 79%;
                  }
              }
          </style>
      </head>
      
      <body>
          <div class="parent">
              <div class="child">
                  <div class="logo">
                      <img src="./email_templates/Imgaes/SQ.png" alt="">
                      <p>SCAN QUEST</p>
                  </div>
                  <hr>
                  <h2 class="p_r">Password Reset Request</h2>
                  <div class="info">
                      <p class="p_one">Dear Admin,</p>
                      <p class="p_two">We received a password reset request from the admin panel for your account. We're
                          pleased to inform you that your password has been successfully updated, and the new login details
                          have been sent to your registered email address.</p>
                      <p class="code">jKp5qR8sT2xW6zY1</p>
                  </div>
                  <div class="info_end">
                      <p class="p_three">To access the admin panel and log in with your updated credentials, click the button
                          below:</p>
                  </div>
                  <div class="login">
                      <img src="http://localhost:3000/uploads/login-button.png" alt="">
                  </div>
                  <hr>
                  <div class="end">
                      <p class="scan_q">Scan Quest</p>
                      <p class="mail">scanquest@gmail.com</p>
                  </div>
              </div>
          </div>
      </body>`
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
