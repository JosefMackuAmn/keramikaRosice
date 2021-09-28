const fs = require('fs');
const path = require('path');

const Category = require('../models/category');
const Config = require('../models/config');

exports.getIndex = async (req, res, next) => {
    const allCatgories = await Category.find({});

    const { announcement } = await Config.getSingleton();
    
    res.render('pages/index', {
        title: 'Domů',
        url: '',
        categories: allCatgories,
        announcement: announcement
    })
}

exports.getAbout = (req, res, next) => {
    res.render('pages/about', {
        title: 'O mně',
        url: 'o-mne'
    });
}

exports.getContact = async (req, res, next) => {
    const allCatgories = await Category.find({});

    res.render('pages/contact', {
        title: 'Kontakt',
        url: 'kontakt',
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