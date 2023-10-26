const {insertPinCode,getPinCodes,updatePinCode,deleteCategory,searchPinCodes}=require('../models/pinCodeService')


async function getAllRecords(req, res) {
    try {
 
      const result = await getPinCodes()
      res.status(200).json({ message: 'Categories fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching games:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

async function insertRecord(req, res) {
    try {
      const { code_for, pin_code ,game_id } = req.body;
      const pinCodeData = {code_for,pin_code,game_id  };
      const result = await insertPinCode(pinCodeData)
      res.status(201).json({ message: 'Pin code added successfully' });
    } catch (err) {
      console.error('Error adding code:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function updateRecord(req,res)
  {
    try
    {
      const {pin_code,code_for}=req.body;

      const code_id=req.params.code_id;
      const pinCodeData={code_id,pin_code,code_for};
      const result=await updatePinCode(pinCodeData);
      res.status(200).json({message:'Pin code updated successfully'})
      
    } catch(err)
    {
      console.error('Error updating pin code:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function deleteRecord(req,res)
  {
    try
    {
      const code_id=req.params.code_id;

      const result=await deleteCategory(code_id);
      res.status(200).json({message:'Record deleted successfully'});
    } catch(err)
    {
      console.error('Error deleting pin code:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function searchRecord(req,res)
  {
    try
    {
      const {search_query, code_for, game_id}=req.body;
      const result=await searchPinCodes(search_query, code_for, game_id);
      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
module.exports={insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}