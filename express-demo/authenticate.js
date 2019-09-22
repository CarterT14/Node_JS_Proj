
function authenticate(req, res, next){
    console.log('Authenticating...');
    next(); //need this to pass control onto the next middleware chain, otherwise its left hanging.
}

module.exports = authenticate; 