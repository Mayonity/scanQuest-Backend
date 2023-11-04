const express = require('express');
const {validate,insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}=require('../controllers/pinCodeController')
const router = express.Router();

router.post('/validate',validate)
router.get('/get-all',getAllRecords)
router.post('/insert',insertRecord)
router.put('/update/:code_id',updateRecord)
router.delete('/delete/:code_id',deleteRecord)
router.post('/search',searchRecord)


module.exports = router;
