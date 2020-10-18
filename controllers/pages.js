const fs = require('fs');
const path = require('path');

const Category = require('../models/category');

exports.getIndex = async (req, res, next) => {
    const allCatgories = await Category.find({});

    res.render('pages/index', {
        title: 'Domů',
        categories: allCatgories
    })
}

exports.getAbout = (req, res, next) => {
    res.render('pages/about', {
        title: 'O mně'
    })
}

exports.getContact = async (req, res, next) => {
    const allCatgories = await Category.find({});

    res.render('pages/contact', {
        title: 'Kontakt',
        categories: allCatgories
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
    const pdfPath = path.join('pdf', 'gdpr.pdf');

    fs.readFile(pdfPath, (err, data) => {
        if (err) return next(err);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="ochrana-osobnich-udaju.pdf"');
        res.send(data);
    });
}