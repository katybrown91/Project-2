const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  authors: String,
  description : [],
  //userId: [Schema.Types.ObjectId, ref="User"]
  userId: String,
  id: String,

});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;