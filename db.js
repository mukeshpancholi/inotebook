const mongoose = require("mongoose");
const conn = mongoose.connect("mongodb://127.0.0.1:27017/notebook");

const connectToMongodb = () => {
  try {
    if (conn) {
      console.log("Database connected successfully...");
    } else {
      console.log("getting error..");
    }
  } catch (error) {
    console.log("connection error", error);
  }
};

module.exports = connectToMongodb;
