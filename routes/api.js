const express = require('express');
const router  = express.Router();
const axios = require('axios');
const Book = require('../models/book');
const user = require('../models/user');



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
  Book.find({userId:req.session.currentUser._id}).then(books=>{
    res.render("library", {books});
  })
  console.log("At the library")
});

  router.post('/library/:id', isLoggedIn, (req, res, next) => {
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