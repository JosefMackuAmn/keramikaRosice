// Basic modules imports
const path = require('path');

// Library imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require('multer');

// Custom imports
const eshopRoutes = require('./routes/eshop');
const pagesRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');
const { db } = require('./models/product');

/////////////////

// Creating app
const app = express();

// Initializing store for sessions
const store = new MongoDBStore({
    uri: process.env.MONGO_CONN_STRING,
    collection: 'sessions'
});
// Adding CSRF protection
const csrfProtection = csrf();

// Define file storage for multer
/* const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
}) */

// Setting view engine
app.set('view engine', 'ejs');

// Using helmet
app.use(helmet());
// Parsing url encoded body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Parsing binary data
/* app.use(multer({storage: fileStorage}).single('image')); */
// Serving static public folder
app.use(express.static(path.join(__dirname, 'public')));
// Using session middleware
app.use(session({
    secret: process.env.SESSION_SECRET_STRING,
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Using CSRF protection after using session middleware
app.use(csrfProtection);

// Passing common props to views
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.cart = req.session.cart;
    next();
});

// Using routes
app.use(eshopRoutes);
app.use(pagesRoutes);
app.use('/admin', adminRoutes);

// Handling 500 case
app.get('/500', (req, res, next) => {
    res.status(500).render('500', {
        title: '500',
        msg: 'Server error'
    })
})

// Handling 404 case
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: '404'
    });
})

// Handling next(error) call
app.use((error, req, res, next) => {
    console.log(error);
    const errorMessage = error.message || error.msg;
    const errorStatus = error.status || 500;
    if (req.headers.accept === 'application/json') {
        return res.status(errorStatus).json({
            msg: errorMessage
        })
    }
    res.status(errorStatus).render('500', {
        title: '500',
        msg: errorMessage
    })
})

// Connect to MongoDB
mongoose
    .connect(
        `${process.env.MONGO_CONN_STRING}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(process.env.PORT || 8080);
    })
    .catch(err => {
        console.log(err);
    })
