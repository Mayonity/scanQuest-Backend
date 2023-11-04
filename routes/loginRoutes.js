const express = require('express');
const {validate,loginAdmin, sendForgetPasswordMail}=require('../controllers/loginController')
const router = express.Router();


router.post('/validate',validate)
router.post('/login',loginAdmin)
router.post('/forget-password',sendForgetPasswordMail)

module.exports = router;
