const express = require('express');
const {insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord, getRulesByGames}=require('../controllers/happinessRatingController')
const router = express.Router();

router.get('/get-all',getAllRecords)
router.post('/insert',insertRecord)
router.put('/update/:rating_id',updateRecord)
router.delete('/delete/:rating_id',deleteRecord)
router.post('/search',searchRecord)
router.get('/get-rules/:game_id',getRulesByGames)

module.exports = router;
