const express = require('express');
const {insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord,updateUserFields, updateStudentFields, getStudentFields}=require('../controllers/fieldControllers')
const router = express.Router();

router.get('/get-all/:game_id',getAllRecords)
router.post('/insert',insertRecord)
router.put('/update/:field_id',updateRecord)
router.delete('/delete/:field_id',deleteRecord)

router.get('/getStudent-fields/:code_id',getStudentFields)
router.post('/user-fields',updateUserFields)
router.post('/update-student',updateStudentFields)


module.exports = router;
