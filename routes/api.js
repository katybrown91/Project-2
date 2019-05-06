const express = require('express');
const router  = express.Router();
const axios = require('axios');
const Book = require('../models/book');
const user = require('../models/user');
const testArr = []


//search

//axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.searchInput}&key=${process.env.APIKEY}&maxResults=40&startIndex=41`)

router.get('/search', (req, res, next) => {
 
  // console.log("the query ---------- ", req.query.searchInput);
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.searchInput}&key=${process.env.APIKEY}&maxResults=10`)
  .then(apiInfo => {
    // console.log("info from API ======== ",  apiInfo.data.items[4].volumeInfo.title,apiInfo.data.items[4].volumeInfo.authors,apiInfo.data.items[4].volumeInfo.description);
    console.log(user.schema.obj.books)
    data = {
      title: String,
      author: String,
      description: []
    }       
    user.schema.obj.books.push(data) 
    // user.books.push(data)
    res.render('search', {books: apiInfo.data.items});
    console.log("This is our test array after pushing")   
    console.log(user.schema.obj.books)    
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
    console.log(req.body, "ostrich")

    newBook.save()
    .then(newSavedBook => {
  
      res.redirect('/library');
    })
    .catch(err => {
      next(err);
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