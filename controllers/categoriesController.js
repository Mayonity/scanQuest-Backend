const {insertCategory,getCategories,updateCategory,deleteCategory,searchCategory}=require('../models/categoriesService')


async function getAllRecords(req, res) {
    try {
 
      const result = await getCategories()
      res.status(200).json({ message: 'Categories fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching games:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

async function insertRecord(req, res) {
    try {
      const { category_name,minimum_products, game_id } = req.body;
      const categoryData = {category_name,minimum_products, game_id  };
      const result = await insertCategory(categoryData)
      res.status(201).json({ message: 'Category added successfully' });
    } catch (err) {
      console.error('Error creating game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function updateRecord(req,res)
  {
    try
    {
      const {category_name,minimum_products}=req.body;

      const category_id=req.params.category_id;
      const categoryData={category_id,category_name,minimum_products};
      const result=await updateCategory(categoryData);
      res.status(200).json({message:'Category Updated Successfully'})
      
    } catch(err)
    {
      console.error('Error updating game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function deleteRecord(req,res)
  {
    try
    {
      const category_id=req.params.category_id;

      const result=await deleteCategory(category_id);
      res.status(200).json({message:'Record deleted successfully'});
    } catch(err)
    {
      console.error('Error deleting game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function searchRecord(req,res)
  {
    try
    {
      const {search_query,game_id}=req.body;
      const result=await searchCategory(search_query,game_id);

      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
module.exports={insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}