const {insertGame,getGames,updateGame,deleteGame,searchGames}=require('../Services/gamesService')


async function getAllRecords(req, res) {
    try {
 
      const result = await getGames(req.query.pageSize,req.query.pageNumber)
    
      res.status(200).json({ message: 'Games fetched successfully', data: result });
    } catch (err) {
      console.error('Error fetching games:', err.message);
      res.status(500).json({ error: 'Error fetching games. Please refresh the page.' });
    }
  }

async function insertRecord(req, res) {
    try {
      const { game_name, game_objectives } = req.body.gameRecord;
      const gameData = { game_name, game_objectives };
      const result = await insertGame(gameData,req.body.current_page)
      res.status(201).json({ message: 'Game created successfully', data:result });
    } catch (err) {
      console.error('Error creating game:', err.message);
      res.status(500).json({ error: 'Error adding game. Please refresh the page and try again.' });
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
      res.status(200).json({message:'Game Updated Successfully', data: result })
      
    } catch(err)
    {
      console.error('Error updating game:', err.message);
      res.status(500).json({ error: 'Error updating game. Please refresh the page and try again.' });
    }
  }

  async function deleteRecord(req,res)
  {
    try
    {
      const game_id=req.params.game_id;

      const result=await deleteGame(game_id);
      res.status(200).json({message:'Game reset successfully'});
    } catch(err)
    {
      console.error('Error deleting game:', err.message);
      res.status(500).json({ error: 'Error deleting game. Please refresh the page and try again.' });
    }
  }

  async function searchRecord(req,res)
  {
    try
    {
      const search_query=req.body.search_query;
      const result=await searchGames(search_query,req.body.current_page);
      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Error searching games. Please refresh the page and try again.' });
    }
  }
module.exports={insertRecord,getAllRecords,updateRecord,deleteRecord,searchRecord}