const {insertField,getFields,updateField,deleteField}=require('../models/fieldService')


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
      const { field_label, field_value, field_type, field_predefine, game_id } = req.body;
      const fieldData = { field_label, field_value, field_type, field_predefine, game_id};
      const result = await insertField(fieldData)
      res.status(201).json({ message: 'Field added successfully' });
    } catch (err) {
      console.error('Error adding field:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function updateRecord(req,res)
  {
    try
    {
      const {field_label, field_value, field_type, field_predefine}=req.body;

      const field_id=req.params.field_id;
      const fieldData={field_id,field_label, field_value, field_type, field_predefine};
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


module.exports={insertRecord,getAllRecords,updateRecord,deleteRecord}