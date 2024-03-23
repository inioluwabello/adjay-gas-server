// Imports
const express = require('express');
const bodyParser = require('body-parser');

// Initialization
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// require database connection 
const dbConnect = require("./db/dbConnect");
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', imageRoutes);
app.use('/api', notificationRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
