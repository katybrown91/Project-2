const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  faveBooks : [{type: Schema.Types.ObjectId, ref: "Book"}],
  friendsList: [{type: Schema.Types.ObjectId, ref: 'User'}],
  userImage : {
    type:String,
    default:'default.png'
    }
   
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;