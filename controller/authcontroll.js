const connection = require('../db/db');
module.exports.login_get = (req, res) => {
    res.send('Login get');
}
module.exports.login_post = (req, res) => {
    const { name, password } = req.body;
    console.log(name);
    console.log(password);
    res.send('Login Post ');
}
module.exports.signup_get = (req, res) => {
    res.send('Sign up get ');
}
module.exports.signup_post = (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    res.send('Sign up post');
}