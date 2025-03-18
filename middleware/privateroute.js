const jwt = require('../jwt/jwt');
const dbcmd = require('../db/dbcmd')
module.exports.checkjwt = (req, res, next) => {
    const token = req.cookies.jwt;
    const data = jwt.verifytoken(token);
    if (!data?.success) {
        res.json({ message: "Authentication Failed" })
    }
    else {
        console.log(req.cookies.jwt);
        // res.send("Hlo");
        next();
    }
}

module.exports.AdminRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    const data = jwt.verifytoken(token);
    const method = req.method;
    if (!data?.success) {
        res.json({ message: "Authentication Failed" })
    }
    else {
        // console.log(data);
        // res.send("Hlo");
        var Userdetails = await dbcmd.getuserdetails(data?.user?.user_id);
        if (Userdetails.role.toLowerCase() === 'visitor' && method === 'GET') {
            next();
            return
        }
        if (Userdetails.role.toLowerCase() === 'admin') {
            next();
        }
        else {
            res.json({ message: "You don't have permission to access this route" });
        }
    }
}