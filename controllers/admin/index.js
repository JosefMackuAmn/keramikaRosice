const categoriesAdminController = require('./categories');
const productsAdminController = require('./products');

const getIndex = (req, res, next) => {
    res.render('admin/index', {
        title: 'Admin index'
    })
}

const getLogin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.render('admin/login', {
        title: 'Login'
    })
}

const postLogin = (req, res, next) => {
    const password = req.body.password;
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            msg: "Wrong password"
        })
    } else if (password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        return req.session.save(err => {
            console.log(err);
            return res.redirect('/admin');
        })
    }
    res.redirect('/');
}

const getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

module.exports = {
    ...categoriesAdminController,
    ...productsAdminController,
    getIndex,
    getLogin,
    postLogin,
    getLogout
}