const {insertRating,getRatings,updatedRating,deleteRating,searchCategory}=require('../Services/happinessRatingService')


async function getAllRecords(req, res) {
    try {
 
      const result = await getRatings(req.query.pageSize,req.query.pageNumber)
      const updatedData = result.data.map(item => {
        const { rating_from, rating_to,...rest } = item; // Destructure the object, removing the pin_code property
        return { ...rest, from: rating_from, to:rating_to }; // Spread the rest of the properties and add the updated code property
      });
      result.data=updatedData
      res.status(200).json({ message: 'Happiness rating fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching records:', err.message);
      res.status(500).json({ error: 'Error fetching happiness ratings. Please refresh the page and try again.' });
    }
  }

async function insertRecord(req, res) {
    try {
      const { rating_from, from_select, rating_to, to_select, rating_deducted, game_id } = req.body.ratingData;
      const ratingData = {rating_from, from_select, rating_to, to_select, rating_deducted, game_id };
      const result = await insertRating(ratingData,req.body.current_page)
      const updatedData = result.data.map(item => {
        const { rating_from, rating_to,...rest } = item; // Destructure the object, removing the pin_code property
        return { ...rest, from: rating_from, to:rating_to }; // Spread the rest of the properties and add the updated code property
      });
      result.data=updatedData
      res.status(200).json({ message: 'Happiness rating added successfully',data:result });
    } catch (err) {
      console.error('Error creating game:', err.message);
      res.status(500).json({ error: 'Error adding happiness rating. Please refresh the page and try again.' });
    }
  }

  async function updateRecord(req,res)
  {
    try
    {
      const {rating_from, from_select, rating_to, to_select, rating_deducted, game_id }=req.body;

      const rating_id=req.params.rating_id;
      const ratingData={rating_id,rating_from, from_select, rating_to, to_select, rating_deducted, game_id };
      const result=await updatedRating(ratingData);
      res.status(200).json({message:'Record Updated Successfully'})
      
    } catch(err)
    {
      console.error('Error updating game:', err.message);
      res.status(500).json({ error: 'Error updating happiness rating. Please refresh the page and try again.' });
    }
  }

  async function deleteRecord(req,res)
  {
    try
    {
      const rating_id=req.params.rating_id;

      const result=await deleteRating(rating_id);
      res.status(200).json({message:'Record deleted successfully'});
    } catch(err)
    {
      console.error('Error deleting game:', err.message);
      res.status(500).json({ error: 'Error deleting happiness rating. Please refresh the page and try again.' });
    }
  }

  async function searchRecord(req,res)
  {
    try
    {
      const {search_query,game_id,current_page}=req.body;
      const result=await searchCategory(search_query,game_id,current_page);
      const updatedData = result.data.map(item => {
        const { rating_from, rating_to,...rest } = item; // Destructure the object, removing the pin_code property
        return { ...rest, from: rating_from, to:rating_to }; // Spread the rest of the properties and add the updated code property
      });
      result.data=updatedData
      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Error searching happiness rating. Please refresh the page and try again.' });
    }
  }
module.exports={insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}