const express = require("express")
const router = express.Router()
const Book = require('../models/books');
const User = require('../models/users');
const middleware = require("../middleware");

router.get('/admin/dashboard', async (req, res) => {

	res.render('admin/index')

})

module.exports = router;