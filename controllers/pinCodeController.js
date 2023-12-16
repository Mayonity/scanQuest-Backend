const jwt = require("jsonwebtoken");
const {validateCode,insertPinCode,getPinCodes,updatePinCode,deleteCategory,searchPinCodes, checkForUniquePIN}=require('../Services/pinCodeService')



function generatePIN() {
  return Math.floor(1000 + Math.random() * 9000);
}


async function generateUniquePIN() {
  let pin = generatePIN();
  let isUnique = await checkForUniquePIN(pin);

  while (!isUnique) {
    pin = generatePIN();
    isUnique = await checkForUniquePIN(pin);
  }

  return pin;
}
async function validate(req,res)
{
  try
  {
    const result=await validateCode(req.body)
 

    if(result.length>0)
    {

      const jwtToken= jwt.sign({pin_code: req.body.pin_code},process.env.CLIENT_SECRET,{ expiresIn: "1h" })
    
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
 
      const result = await getPinCodes(req.query.pageSize,req.query.pageNumber)
      const updatedData = result.data.map(item => {
        const { pin_code, code_for,...rest } = item; // Destructure the object, removing the pin_code property
        return { ...rest, code: pin_code, for:code_for }; // Spread the rest of the properties and add the updated code property
      });
      result.data=updatedData
      
      res.status(200).json({ message: 'codes fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching codes:', err.message);
      res.status(500).json({ error: 'Error fetching pin codes. Please refresh the page and try again.' });
    }
  }

async function insertRecord(req, res) {
    try {
      const { code_for, pin_code ,game_id, no_of_codes } = req.body.pin_code;
      if(no_of_codes!==undefined)
      {
        let result

        for (let index = 0; index < no_of_codes; index++) {
         
          const pin_code= await generateUniquePIN()
        
        const pinCodeData = {code_for,pin_code,game_id  };
         result = await insertPinCode(pinCodeData, req.body.current_page)
          
        }
        
        console.log("no of codes ",no_of_codes, pin_code)
        const updatedData = result.data.map(item => {
          const { pin_code, code_for,...rest } = item; // Destructure the object, removing the pin_code property
          return { ...rest, code: pin_code, for:code_for }; // Spread the rest of the properties and add the updated code property
        });
      result.data=updatedData
      res.status(201).json({ message: 'Pin code added successfully',data:result });
      }
      else
      {

        const pinCodeData = {code_for,pin_code,game_id  };
        let isUnique
        if(pinCodeData.code_for=='Trainer')
        {

          isUnique= await checkForUniquePIN(pinCodeData.pin_code,pinCodeData.game_id)
        }
        else
        {
          isUnique= await checkForUniquePIN(pinCodeData.pin_code)

        }
         if(isUnique)
         {

        const result = await insertPinCode(pinCodeData, req.body.current_page)
        const updatedData = result.data.map(item => {
          const { pin_code, code_for,...rest } = item; // Destructure the object, removing the pin_code property
          return { ...rest, code: pin_code, for:code_for }; // Spread the rest of the properties and add the updated code property
        });
      result.data=updatedData
      res.status(201).json({ message: 'Pin code added successfully',data:result });
    }
    
    else
    {

      res.status(400).json({ error: 'Duplicate entry: Pin code already exists.' });
    }
      }
        
    } catch (err) {
    
      if (err.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry error
        console.error('Duplicate entry error: The provided pin code already exists.');
        // Send an error response to your frontend
        res.status(400).json({ error: 'Duplicate entry: Pin code already exists.' });
    } else {
        // Handle other errors
        console.error('Unexpected error occurred:', err);
        // Send a generic error response to your frontend
        res.status(500).json({ error: 'Internal server error.' });
    }
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
      if (err.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry error
        console.error('Duplicate entry error: The provided pin code already exists.');
        // Send an error response to your frontend
        res.status(400).json({ error: 'Duplicate entry: Pin code already exists.' });
    } else {
        // Handle other errors
        console.error('Unexpected error occurred:', err);
        // Send a generic error response to your frontend
        res.status(500).json({ error: 'Internal server error.' });
    }
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
      res.status(500).json({ error: 'Error deleting pin code. Please refresh the page and try again.' });
    }
  }

  async function searchRecord(req,res)
  {
    try
    {
      const {search_query, code_for, game_id,current_page}=req.body;
      const result=await searchPinCodes(search_query, code_for, game_id,current_page);
      const updatedData = result.data.map(item => {
        const { pin_code, code_for,...rest } = item; // Destructure the object, removing the pin_code property
        return { ...rest, code: pin_code, for:code_for }; // Spread the rest of the properties and add the updated code property
      });
      result.data=updatedData
      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Error searching pin codes. Please refresh the page and try again.' });
    }
  }

  
module.exports={validate,insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}