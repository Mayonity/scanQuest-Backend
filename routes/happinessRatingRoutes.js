const express = require('express');
const {insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}=require('../controllers/happinessRatingController')
const router = express.Router();

router.get('/get-all',getAllRecords)
router.post('/insert',insertRecord)
router.put('/update/:rating_id',updateRecord)
router.delete('/delete/:rating_id',deleteRecord)
router.post('/search',searchRecord)


module.exports = router;
