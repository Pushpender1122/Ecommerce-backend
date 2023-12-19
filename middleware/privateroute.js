const jwt = require('../jwt/jwt');
module.exports.checkjwt = (req, res, next) => {
    const token = req.cookies.jwt;
    const data = jwt.verifytoken(token);
    if (!data) {
        res.json({ message: "Authentication Failed" })
    }
    else {
        console.log(req.cookies.jwt);
        // res.send("Hlo");
        next();
    }
}