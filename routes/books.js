const express = require("express")

const router = express.Router()
const Book = require('../models/books');



router.get('/book/:id', async (req, res,) => {
    const book = await Book.findById(req.params.id)
    if (!book) {
        return res.redirect('/');
    }
    res.render('books/show', { book });
});

// router.get('/myAccount', async (req, res) => {
//     res.render('myAccount')
// })


router.get('/books/all', async (req, res) => {
    const books = await Book.find({})
    res.render('books/all', { books })
})


module.exports = router;