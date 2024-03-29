const helper = {}

helper.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/signin');
    }
}

helper.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin' || req.user.role === "helper" || req.user.role === "mod")
        return next();
    return res.render('404');
};

module.exports = helper;