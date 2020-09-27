// Basic module imports
const path = require('path');

// Library imports
const express = require('express');
const bodyParser = require('body-parser');

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

// Handling 404 case
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: '404'
    });
})

// Listening to requests
app.listen(process.env.PORT || 8080);
