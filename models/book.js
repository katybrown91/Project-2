const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: String,
  description : [],
  image: String,
  //userId: [Schema.Types.ObjectId, ref="User"]
  userId: String,
  id: String,

});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;