const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer = require("multer");
const { uid } = require('uid');
const sanitizer = require("express-sanitizer");
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
//models
const User = require('./models/users');
const userRoutes = require("./routes/users")

const bookRoutes = require("./routes/books")
const subRoutes = require("./routes/subscription")
const adminRoutes = require("./routes/admin")



// const Book = require('./models/Books');
// const Issue = require('./models/issue');
// const activity = require('./models/activity');

// const userController = require('./utils/userFunctions');
// const middleware = require("./middleware");


mongoose.connect('mongodb://localhost:27017/projecttest', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongo connected")
    })
    .catch(err => {
        console.log(`mongo error ${err}`)
    })

const app = express();
app.use(flash());
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'unloko',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    next();
})



// configure image file storage
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, `${uid()}-${file.originalname}`);
    },
});

const filefilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(
    multer({ storage: fileStorage, fileFilter: filefilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});

//Routes
app.use(userRoutes);
app.use(bookRoutes);
app.use(subRoutes);
app.use(adminRoutes);



app.get('/faq', (req, res) => {
    res.render('faq');
})

app.get('/help', (req, res) => {
    res.render('help');
})

app.get('/', (req, res) => {
    res.render('index');
})




// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = 'Oh No, Something Went Wrong!'
//     res.status(statusCode).render('error', { err })
// })


app.listen(3000, () => {
    console.log('listening')
})