const {insertCategory,getCategories,updateCategory,deleteCategory,searchCategory}=require('../Services/categoriesService')


async function getAllRecords(req, res) {
    try {
 
      const result = await getCategories(req.query.pageSize,req.query.pageNumber)
      res.status(200).json({ message: 'Categories fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching categories', err.message);
      res.status(500).json({ error: 'Error fetching categories. Please refresh the page. ' });
    }
  }

async function insertRecord(req, res) {
    try {
      const { category_name,minimum_products, game_id } = req.body.categoryData;
      const categoryData = {category_name,minimum_products, game_id  };
      const result = await insertCategory(categoryData,req.body.current_page)
      res.status(201).json({ message: 'Category added successfully',data:result });
    } catch (err) {
      console.error('Error adding categories:', err.message);
      res.status(500).json({ error: 'Error adding category. Please refresh the page and try again.' });
    }
  }

  async function updateRecord(req,res)
  {
    try
    {
      const {category_name,minimum_products, game_id}=req.body;

      const category_id=req.params.category_id;
      const categoryData={category_id,category_name,minimum_products, game_id};
      const result=await updateCategory(categoryData);
      res.status(200).json({message:'Category Updated Successfully'})
      
    } catch(err)
    {
      console.error('Error updating category:', err.message);
      res.status(500).json({ error: 'Error updating category. Please refresh the page and try again.' });
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
      console.error('Error deleting category:', err.message);
      res.status(500).json({ error: 'Error deleting category. Please refresh the page and try again.' });
    }
  }

  async function searchRecord(req,res)
  {
    try
    {
      const {search_query,game_id,current_page}=req.body;
      const result=await searchCategory(search_query,game_id,current_page);

      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching category:', err.message);
      res.status(500).json({ error: 'Error searching category. Please refresh the page and try again.' });
    }
  }
module.exports={insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}