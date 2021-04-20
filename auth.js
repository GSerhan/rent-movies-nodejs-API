function auth(req, res, next) {
    console.log('auth...');
    next();
}

module.exports = auth;