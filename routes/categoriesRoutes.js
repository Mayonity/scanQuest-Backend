const express = require('express');
const {insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord, getGameCategories,getCategoriesForProducts}=require('../controllers/categoriesController')
const router = express.Router();

router.get('/get-all',getAllRecords)
router.get('/get-game-categories/:game_id',getGameCategories)
router.post('/insert',insertRecord)
router.put('/update/:category_id',updateRecord)
router.delete('/delete/:category_id',deleteRecord)
router.post('/search',searchRecord)
router.get('/get-product-categories/:game_id',getCategoriesForProducts)


module.exports = router;
