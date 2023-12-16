const express = require('express');
const {insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord,getAllProducts, exportRecord}=require('../controllers/studentsControllers')
const router = express.Router();


router.get('/get-all',getAllRecords)
router.post('/insert',insertRecord)
router.put('/update/:game_id',updateRecord)
router.delete('/delete/:student_id',deleteRecord)
router.post('/search',searchRecord)
router.post('/get-products',getAllProducts)
router.get('/export',exportRecord)

module.exports = router;
