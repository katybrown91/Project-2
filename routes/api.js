const express = require('express');
const router  = express.Router();
const axios = require('axios');
const Book = require('../models/book');
const User = require('../models/user');



//search

//axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.searchInput}&key=${process.env.APIKEY}&maxResults=40&startIndex=41`)

router.get('/search', (req, res, next) => {
 
  // console.log("the query ---------- ", req.query.searchInput);
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.searchInput}&key=${process.env.APIKEY}&maxResults=10`)
  .then(apiInfo => {
    console.log("info from API ======== ",  apiInfo.data.items[4].volumeInfo.title,apiInfo.data.items[4].volumeInfo.authors,apiInfo.data.items[4].volumeInfo.description,
    apiInfo.data.items[4].volumeInfo.imageLinks.thumbnail);
   
    data = {
      title: String,
      authors: String,
      description: [],
      image: String
    }       
    res.render('search', {books: apiInfo.data.items});
  
  
  })
  .catch(err => {
    console.log("An error occurred in the catch")
    next(err);

  });
});

//Save to library

router.get("/library", isLoggedIn, (req, res, next) => {
  console.log("the current user while at my library >>>>>>>>>>>>>>>>> ", req.session.currentUser);
  Book.find({userId:req.session.currentUser._id}).then(books=>{
    // console.log("the books from my library ===============", books)
    res.render("library", {books});
  })
  console.log("At the library")
});

  router.post('/library/:id', isLoggedIn, (req, res, next) => {
    // console.log("the req body of the book id ---------- ", req.body, req.user);
    // Book.find({id: req.params.id})
    // .then(bookFromDb => {
    //   console.log("the book from the DB =========== ", bookFromDb)
    //   if(bookFromDb) {
    //     user.findById(req.session.currentUser._id)
    //     .then(theUser => {
    //       theUser.faveBooks.push(bookFromDb._id)
    //       theUser.save()
    //       .then(updatedUser => {
    //         console.log("the updated user after adding book >>>>>>>>>>>>>> ", updatedUser);
    //         res.redirect('/library');
    //       })
    //       .catch(err => {
    //         next(err);
    //       })
    //     })
    //     .catch(err => {
    //       next(err);
    //     })
    //   } else {
    //     let book = req.body 
    //     book.id = req.params.id; 
    //     const newBook = new Book(book); 
    //     newBook.save()
    //     .then(bookFromDb => {
    //       user.findById(req.session.currentUser._id)
    //       .then(theUser => {
    //         theUser.faveBooks.push(bookFromDb._id)
    //         theUser.save()
    //         .then(updatedUser => {
    //           console.log("the updated user after adding book to the DB >>>>>>>>>>>>>> ", updatedUser);
    //           res.redirect('/library');
    //         })
    //         .catch(err => {
    //           next(err);
    //         })
    //       })
    //       .catch(err => {
    //         next(err);
    //       })
    //     })
    //     .catch(err => {
    //       next(err);
    //     })
    //   }
    // })
    // .catch(err => {
    //   next(err);
    // })




    let book = req.body                    
    book.userId = req.session.currentUser._id
    book.id = req.params.id; 
    const newBook = new Book(book);  

    newBook.save()
    .then(newSavedBook => {
  
      res.redirect('/library');
    })
    .catch(err => {
      next(err);
    });
  });

  //Delete from library

  router.get("/library/delete", (req, res, next) => {
    Book.findByIdAndRemove(req.query.book_id)
      .then((books) => {
        res.redirect("/library");
      })
      .catch(error => {
        next(error);
      });
  });

  

  
    
  
  


function isLoggedIn(req, res, next){
  console.log(req.session.currentUser)
  if(req.session.currentUser){
    next()

  } else {
    res.redirect('/login')

  }
}


     
 




module.exports = router;