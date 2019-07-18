
function log(req, res, next){
    console.log('Logging...');
    next(); //need this to pass control onto the next middleware chain, otherwise its left hanging.
}

module.exports = log;