const fs = require('fs');
const path = require('path');

exports.getIndex = (req, res, next) => {
    res.render('pages/index', {
        title: 'Domů'
    })
}

exports.getAbout = (req, res, next) => {
    res.render('pages/about', {
        title: 'O mně'
    })
}

exports.getContact = (req, res, next) => {
    res.render('pages/contact', {
        title: 'Kontakt'
    })
}

exports.getConditions = (req, res, next) => {
    const pdfPath = path.join('pdf', 'conditions.pdf');
    fs.readFile(pdfPath, (err, data) => {
        if (err) return next(err);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="conditions.pdf"');
        res.send(data);
    });
}

exports.getGDPR = (req, res, next) => {
    const pdfPath = path.join('pdf', 'conditions.pdf');
    fs.readFile(pdfPath, (err, data) => {
        if (err) return next(err);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="conditions.pdf"');
        res.send(data);
    });
}