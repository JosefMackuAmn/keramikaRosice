// Core modules imports
const path = require('path');
const fs = require('fs');

// Library imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require('multer');
const morgan = require('morgan');
const compression = require('compression');

// Custom imports
const eshopRoutes = require('./routes/eshop');
const pagesRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');

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
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        let prefix = 'pimg_';
        if (req.url.includes('categories')) {
            prefix = 'cimg_'
        }

        let dateString = new Date().toISOString();
        dateString = dateString.replace(/:/g, '');
        dateString = dateString.replace('\.', '');
    
        const fileName = prefix + dateString + '-' + file.originalname;

        cb(null, fileName);
    }
})
// Define file filter for multer
const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Creating write stream for morgan
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), {
    flags: 'a'
});

// Setting view engine
app.set('view engine', 'ejs');

// Using helmet
app.use(helmet());
// Using compression
app.use(compression());
// Using morgan
app.use(morgan('combined', { stream: accessLogStream }));


// Parsing url encoded body
app.use((req, res, next) => {
    if (req.url === '/checkout-webhook') {
        return next();
    }
    return bodyParser.urlencoded({ extended: false })(req, res, next);
});
app.use((req, res, next) => {
    if (req.url === '/checkout-webhook') {
        return next();
    }
    return bodyParser.json()(req, res, next);
});

// Parsing binary data
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
// Serving static public folder
app.use(express.static(path.join(__dirname, 'public')));
// Using session middleware
app.use(session({
    secret: process.env.SESSION_SECRET_STRING,
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Using CSRF protection after using session middleware (excluding stripe webhook route)
app.use((req, res, next) => {
    if (req.url === '/checkout-webhook') {
        return next();
    }
    return csrfProtection(req, res, next);
});

// Passing common props to views
app.use((req, res, next) => {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
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
        url: '500',
        msg: 'Server error'
    })
}) // ------------------------ DOES THIS HAVE TO BE HERE? -----------

// Handling 404 case
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: '404',
        url: '404'
    });
});

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
        title: 'Error ' + errorStatus,
        url: '500',
        msg: errorMessage
    });
})

// Connect to MongoDB
mongoose
    .connect(
        `${process.env.MONGO_CONN_STRING}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(process.env.PORT || 8080);
        console.log(`App listening on port ${process.env.PORT || 8080}`)
    })
    .catch(err => {
        console.log(err);
    })
