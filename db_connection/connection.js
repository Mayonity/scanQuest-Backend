const mysql = require("mysql");

const dbConnection = mysql.createConnection({
  host: "localhost", // Your database host name
  user: "root", // Your database username
  password: "", // Your database password
  database: "scanquest", // Your database name
});

module.exports=dbConnection