const express = require("express");
const multer = require('multer');
const PORT = process.env.PORT | 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const gameRoutes = require("./routes/gameRoutes");
const fieldRoutes=require("./routes/fieldRoutes")
const categoriesRoutes=require('./routes/categoriesRoutes')
const pinCodeRoutes=require('./routes/pinCodeRoutes')
const productRoutes=require('./routes/productRoutes')

const dbConnection = require("./db_connection/connection");

dbConnection.connect((err) => {
  if (err) {
    console.log("Error connecting with database");
    return;
  }

  console.log("connected to database");

  app.use("/api/games", gameRoutes);
  app.use("/api/fields", fieldRoutes);
  app.use('/api/categories',categoriesRoutes)
  app.use('/api/pin-codes',pinCodeRoutes)
  app.use('/api/products',productRoutes)

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
