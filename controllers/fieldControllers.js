const {insertField,getFields,updateField,deleteField, insertStudentField, updateStudentFieldsVals, getAllStudentFields}=require('../Services/fieldService')


async function getAllRecords(req, res) {
    try {
 
      const result = await getFields(req.params.game_id)
      
      res.status(200).json({ message: 'Fields fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching fields:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

async function insertRecord(req, res) {
    try {
      const { label, value, type, status, game_id } = req.body;
      const fieldData = { label, value, type, status, game_id};
      const result = await insertField(fieldData)
      res.status(201).json({ message: 'Field added successfully',data:result });
    } catch (err) {
      console.error('Error adding field:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function updateRecord(req,res)
  {
    try
    {
      const {label, value, type, status,game_id}=req.body;

    
      const field_id=req.params.field_id;
      const fieldData={field_id,label, value, type, status, game_id};
      const result=await updateField(fieldData);
      res.status(200).json({message:'Field Updated Successfully'})
      
    } catch(err)
    {
      console.error('Error updating field:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function deleteRecord(req,res)
  {
    try
    {
      const field_id=req.params.field_id;

      const result=await deleteField(field_id);
      res.status(200).json({message:'FIeld deleted successfully'});
    } catch(err)
    {
      console.error('Error deleting field:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const updateUserFields=async(req,res)=>
  {

    try
    {
      
      req.body.textFields.forEach(element => {
        
     
      const {field_id,label, value, type, status}=element;

      const fieldData={field_id,label, value, type, status};
      const result= updateField(fieldData);
    });
    res.status(200).json({message:'Field Updated Successfully'})
      
    } catch(err)
    {
      console.error('Error updating field:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  async function getStudentFields(req,res)
  {
    try {
 
      const result = await getAllStudentFields(req.params.code_id)
      
      res.status(200).json({ message: 'Fields fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching fields:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

async function insertStudentFields(code_id,game_id)
  {
    try {
      // const { label, value, type, status,code_id,game_id } = req.body;

      const fields=await getFields(game_id)

      // console.log('fields ',fields)
      fields.map(async(field,index)=>
      {
        console.log(field)
      field.code_id=code_id
      

      const result = await insertStudentField(field)

      })
      // const fieldData = { label, value, type, status,code_id,game_id};
      return 1
    } catch (err) {
      console.error('Error adding field:', err.message);
      return err
    }
  }

  async function updateStudentFields(req,res)
  {
    try
    {

       
      req.body.textFields.forEach(element => {
        
     
      const {id ,label, value, type, status}=element

     
      const fieldData={id,label, value, type, status};
      const result=updateStudentFieldsVals(fieldData);
      })
      
      res.status(200).json({message:'Field Updated Successfully'})
      
    } catch(err)
    {
      console.error('Error updating field:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports={insertRecord,getAllRecords,updateRecord,deleteRecord,updateUserFields, insertStudentFields, updateStudentFields, getStudentFields}