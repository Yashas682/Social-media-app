const mongoose = require('mongoose');
const Mongo_URL = 'mongodb+srv://yashas682:1234@cluster0.zctczhr.mongodb.net/?retryWrites=true&w=majority'
// Connect to the MongoDB database using the Mongo_URL environment variable
mongoose.connect(Mongo_URL)
  .then(() => {
    console.log("Connected to DB 😊");
  })
  .catch((err) => {
    console.log("Err in connecting to DB 😐", err);
  });