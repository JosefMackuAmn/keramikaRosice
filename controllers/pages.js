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