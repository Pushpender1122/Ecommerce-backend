const dbcmd = require('../db/dbcmd');
module.exports.login_get = (req, res) => {
    res.send('Login get');
}
module.exports.login_post = (req, res) => {
    const { name, password } = req.body;

    res.send('Login Post');
}
module.exports.signup_get = (req, res) => {
    res.send('Sign up get ');
}
module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;
    var message = { Name: "", Email: "", Password: "" };
    dbcmd.createTable();
    console.log(name, email, password);
    if (name.length < 3) {
        message.Name = "Name should contain alleast 3 characters";
    }
    if (email.length < 5) {
        message.Email = "Not valid email";
    }
    if (password.length < 1) {
        message.Password = "Password must be long then 1";
    }
    if (name.length >= 3 && email.length >= 5 && password.length >= 1) {
        let Check = await dbcmd.findEmail(email);
        if (Check) {
            res.send("User Already exist");
        }
        else {
            Check = await dbcmd.NewUser(name, email, password);
            if (Check) {
                res.send("User Created Succesfull");
            }
        }
    }
    else {
        res.send(message);
    }
}