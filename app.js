// Basic module imports
const path = require('path');

// Library imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Custom imports
const eshopRoutes = require('./routes/eshop');
const pagesRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');

// Creating app
const app = express();

// Setting view engine
app.set('view engine', 'ejs');

// Parsing url encoded body
app.use(bodyParser.urlencoded({ extended: false }));
// Serving static public folder
app.use(express.static(path.join(__dirname, 'public')));

// Using routes
app.use(eshopRoutes);
app.use(pagesRoutes);
app.use('/admin', adminRoutes);

// Handling 500 case
app.get('/500', (req, res, next) => {
    res.status(500).render('500', {
        title: '500'
    })
})

// Handling 404 case
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: '404'
    });
})

// Handling 500 case
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).render('500', {
        title: '500'
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
