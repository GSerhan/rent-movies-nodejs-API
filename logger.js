function log(req, res, next) {
    console.log('login...');
    next();
}

module.exports = log;