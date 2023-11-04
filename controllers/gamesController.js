const {insertGame,getGames,updateGame,deleteGame,searchGames}=require('../Services/gamesService')


async function getAllRecords(req, res) {
    try {
 
      const result = await getGames()
      res.status(200).json({ message: 'Games fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching games:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

async function insertRecord(req, res) {
    try {
      const { game_name, game_objectives } = req.body;
      const gameData = { game_name, game_objectives };
      const result = await insertGame(gameData)
      res.status(201).json({ message: 'Game created successfully' });
    } catch (err) {
      console.error('Error creating game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function updateRecord(req,res)
  {
    try
    {
      const {game_name,game_objectives}=req.body;

      const game_id=req.params.game_id;
      const gameData={game_id,game_name,game_objectives};
      const result=await updateGame(gameData);
      res.status(200).json({message:'Game Updated Successfully'})
      
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
      const game_id=req.params.game_id;

      const result=await deleteGame(game_id);
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
      const search_query=req.body.search_query;
      const result=await searchGames(search_query);
      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
module.exports={insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}