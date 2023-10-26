const express = require('express');
const {insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}=require('../controllers/fieldControllers')
const router = express.Router();

router.get('/get-all/:game_id',getAllRecords)
router.post('/insert',insertRecord)
router.put('/update/:field_id',updateRecord)
router.delete('/delete/:field_id',deleteRecord)


module.exports = router;
