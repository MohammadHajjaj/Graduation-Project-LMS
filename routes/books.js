const express = require("express")

const router = express.Router()
const Book = require('../models/books');
const PER_PAGE = 16;



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


// router.get('/books/all', async (req, res) => {
//     const books = await Book.find({})
//     res.render('books/all', { books })
// })
router.get("/books/:filter/:value/:page", async (req, res, next) => {
    var page = req.params.page || 1;
    const filter = req.params.filter;
    const value = req.params.value;
    let searchObj = {};

    // constructing search object
    if (filter != 'all' && value != 'all') {
        // fetch books by search value and filter
        searchObj[filter] = value;
    }

    try {
        // Fetch books from database
        const books = await Book
            .find(searchObj)
            .skip((PER_PAGE * page) - PER_PAGE)
            .limit(PER_PAGE);

        // Get the count of total available book of given filter
        const count = await Book.find(searchObj).countDocuments();

        res.render("books/all", {
            books: books,
            current: page,
            pages: Math.ceil(count / PER_PAGE),
            filter: filter,
            value: value,
            user: req.user,
        })
    } catch (err) {
        console.log(err)
    }
})
router.post("/books/:filter/:value/:page", async (req, res, next) => {
    var page = req.params.page || 1;
    let filter = req.body.filter;
    const value = req.body.searchName;

    // show flash message if empty search field is sent to backend
    if (value == "") {
        req.flash("error", "Searc field is empty. Please fill the search field in order to get a result");
        return res.redirect('back');
    }
    else if (!filter) {
        filter = 'title'
    }
    filter = filter.toLowerCase();

    const searchObj = {};
    searchObj[filter] = value;

    try {
        // Fetch books from database
        const books = await Book
            .find(searchObj)
            .skip((PER_PAGE * page) - PER_PAGE)
            .limit(PER_PAGE)

        // Get the count of total available book of given filter
        const count = await Book.find(searchObj).countDocuments();

        res.render("books/all", {
            books: books,
            current: page,
            pages: Math.ceil(count / PER_PAGE),
            filter: filter,
            value: value,
            user: req.user,
        })
    } catch (err) {
        console.log(err)
    }
})
module.exports = router;