const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const friendSchema = new Schema({
  username: String,
  email: String,
  //faveBooks : [{type: Schema.Types.ObjectId, ref: "Book"}]

});

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;