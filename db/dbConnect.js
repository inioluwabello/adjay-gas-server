const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "adjaygas", //
  });
  
  const db = mongoose.connection;

  // Check for DB connection
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => console.log("Connected to DB"));
}

module.exports = dbConnect;
