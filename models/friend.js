const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const friendSchema = new Schema({
  username: String,
  email: String,

});

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;