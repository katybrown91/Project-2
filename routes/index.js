const express = require("express");
const router = express.Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const Friend = require("../models/friend");

//Messages
router.get("/message", (req, res, next) => {
  res.render("message");
});
console.log("Hello!");

router.post("/send-email", (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  transporter
    .sendMail({
      from: '"Book App Project" <bookapp@project.com>',
      to: email,
      subject: subject,
      text: message,
      html: `<b>${message}</b>`
    })
    .then(info => res.render("message", { email, subject, message, info }))
    .catch(error => console.log(error));
});

// /* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

//Find Friends

router.get("/search-friends", (req, res, next) => {
  res.render("search-friends");
});
console.log("Hello!");
router.get("/search-friends", isLoggedIn, function(req, res) {
  Friend.find({ username: { $ne: req.user.username } }, function(err, result) {
    if (err) throw err;
    res.render("search-friends", {
      result: result
    });
  });
});

router.post("/search-friends", isLoggedIn, function(req, res) {
  console.log('in this',req.session.currentUser, res.body)
  var searchfriend = req.body.searchfriend;
  if (searchfriend == req.session.currentUser.username) {
    searchfriend = null;
  }
  User.find({ username: searchfriend }, function(err, result) {
    if (err) throw err;
    res.render("search-friends", {
      result: result
    });
  });
});

function isLoggedIn(req, res, next) {
  console.log(req.session.currentUser);
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

//Add Friends

router.get("/my-friends", isLoggedIn, (req, res, next) => {
  console.log("My friends")
  // Friend.find({userId:req.session.currentUser._id}).then(friend=>{
    User.findById(req.session.currentUser._id).populate('friendsList')
    .then(friend => {

      console.log("the user info for friends route ================ ", friend)
      res.render("my-friends", {friend});
    })
    .catch(err => {
      next(err);
    })
  })
// });

  router.post('/my-friends/:id', isLoggedIn, (req, res, next) => {
    User.findById(req.session.currentUser._id)
    .then(theUser => {
      console.log("this is the current user >>>>>>>>>>>>>>", theUser)
        theUser.friendsList.push(req.params.id)
        theUser.save()
        .then(newSavedFriend => {
          console.log("the updated user <<<<<<<<<<<<>>>>>>>>>>>>", newSavedFriend);
          res.redirect('/my-friends');

      })
      .catch(err => {
        next(err);
      })
    })
    .catch(err => {
      next(err);
    });
  });

  //Reject Friends

  router.get("/search-friends/delete", (req, res, next) => {
    Friend.findByIdAndRemove(req.query.friend_id)
      .then((friends) => {
        res.redirect("/search-friends");
      })
      .catch(error => {
        next(error);
      });
  });

  //Delete Friends
  
  router.get("/my-friends/delete", (req, res, next) => {
    Friend.findByIdAndRemove(req.query.friend_id)
      .then((friends) => {
        res.redirect("/my-friends");
      })
      .catch(error => {
        next(error);
      });
  });

  //User Avatar


module.exports = router;
