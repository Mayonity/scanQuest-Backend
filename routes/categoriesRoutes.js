const express = require('express');
const {insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}=require('../controllers/categoriesController')
const router = express.Router();

router.get('/get-all',getAllRecords)
router.post('/insert',insertRecord)
router.put('/update/:category_id',updateRecord)
router.delete('/delete/:category_id',deleteRecord)
router.post('/search',searchRecord)


module.exports = router;
