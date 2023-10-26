const express = require('express');
const {insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}=require('../controllers/gamesController')
const router = express.Router();

router.get('/get-all',getAllRecords)
router.post('/insert',insertRecord)
router.put('/update/:game_id',updateRecord)
router.delete('/delete/:game_id',deleteRecord)
router.post('/search',searchRecord)


module.exports = router;
