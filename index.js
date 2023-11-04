const express = require("express");
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT | 3000;
const app = express();
const corsOptions = {
  origin: 'http://localhost:3001', // Allow any localhost port to access the resources
  optionsSuccessStatus: 200,
  credentials:true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const verifyToken=require('./middlewares/validateToken')

const loginRoutes=require('./routes/loginRoutes')
const gameRoutes = require("./routes/gameRoutes");
const fieldRoutes=require("./routes/fieldRoutes")
const categoriesRoutes=require('./routes/categoriesRoutes')
const pinCodeRoutes=require('./routes/pinCodeRoutes')
const productRoutes=require('./routes/productRoutes')
const happinessRatingRoutes=require('./routes/happinessRatingRoutes')
const studentRoutes=require('./routes/studentsRoutes')

const dbConnection = require("./db_connection/connection");

dbConnection.connect((err) => {
  if (err) {
    console.log("Error connecting with database");
    return;
  }
  

  app.use('/uploads', express.static('uploads'));

  console.log("connected to database");
app.use('/api/user',loginRoutes)
  app.use("/api/games", verifyToken, gameRoutes);
  app.use("/api/fields",verifyToken, fieldRoutes);
  app.use('/api/categories',verifyToken,categoriesRoutes)
  app.use('/api/pin-codes',verifyToken,pinCodeRoutes)
  app.use('/api/products',verifyToken,productRoutes)
  app.use('/api/happiness-rating',verifyToken,happinessRatingRoutes)
  app.use('/api/students',verifyToken,studentRoutes)
  

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
