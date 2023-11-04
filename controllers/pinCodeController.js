const jwt = require("jsonwebtoken");
const {validateCode,insertPinCode,getPinCodes,updatePinCode,deleteCategory,searchPinCodes}=require('../Services/pinCodeService')


async function validate(req,res)
{
  try
  {
    const result=await validateCode(req.body)
 

    if(result.length>0)
    {
     console.log(process.env.CLIENT_SECRET)
      const jwtToken= jwt.sign({pin_code: req.body.pin_code},process.env.CLIENT_SECRET,{ expiresIn: "1h" })
      console.log(jwtToken)
      res.status(200).json({ message: 'Authorized successfully', data: result, token:jwtToken });
    }
    else
    {
      res.status(401).json({ message: 'Authorized successfully', data: result });
    
    }


  }
  catch(err)
  {
    console.error('Error validating:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getAllRecords(req, res) {
    try {
 
      const result = await getPinCodes()
      const updatedData = result.map(item => {
        const { pin_code, code_for,...rest } = item; // Destructure the object, removing the pin_code property
        return { ...rest, code: pin_code, for:code_for }; // Spread the rest of the properties and add the updated code property
      });
      
      res.status(200).json({ message: 'codes fetched successfully', data: updatedData });
    } catch (err) {
      console.error('Error fetching codes:', err.message);
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
      const {pin_code,code_for,game_id}=req.body;

      const code_id=req.params.code_id;
      const pinCodeData={code_id,pin_code,code_for,game_id};
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
      const updatedData = result.map(item => {
        const { pin_code, code_for,...rest } = item; // Destructure the object, removing the pin_code property
        return { ...rest, code: pin_code, for:code_for }; // Spread the rest of the properties and add the updated code property
      });
      res.status(200).json({message:'Search done successfully', data:updatedData});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
module.exports={validate,insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}