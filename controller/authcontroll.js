const dbcmd = require('../db/dbcmd');
const Productdb = require('../db/productdb');
const productModle = require('../db/productSchema');
module.exports.login_get = (req, res) => {
    res.send('Login get');
}
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body.data;
    var check = await dbcmd.findEmail(email);
    if (check) {
        check = await dbcmd.getPassword(email, password);
        if (check) {
            res.json({ message: "Succesfull login" });
        }
        else {

            res.json({ message: "Password incorrect" });
        }
    }
    else {
        res.json({ message: 'Email not found' });
    }
}
module.exports.signup_get = (req, res) => {
    res.send('Sign up get ');
}
module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body.data;
    var message = { Name: "", Email: "", Password: "" };
    dbcmd.createTable();
    console.log(name, email, password);
    if (name?.length < 3) {
        message.Name = "Name should contain alleast 3 characters";
    }
    if (email?.length < 1) {
        message.Email = "Please enter a email";
    }
    if (email?.length < 5 && email?.length > 1) {
        message.Email = "Not valid email";
    }
    if (password?.length < 1) {
        message.Password = "Password must be long then 1";
    }
    if (name?.length >= 3 && email?.length >= 5 && password?.length >= 1) {
        let Check = await dbcmd.findEmail(email);
        if (Check) {
            res.json({ message: "User Already exist" });
        }
        else {
            Check = await dbcmd.NewUser(name, email, password);
            if (Check) {
                res.json({ message: "User Created Succesfull" });
            }
        }
    }
    else {
        res.send(message);
    }
}
// admin page

// this is mysql
// module.exports.addProduct = async (req, res) => {
//     const { ProductId, ProductName, ProductPrice, description, Category, rating, Stock, img } = req.body;
//     console.log(img);
//     const Result = await Productdb.InsertNewProduct(ProductId, ProductName, ProductPrice, Category, description, rating, Stock);
//     console.log(Result);
//     if (Result === "ER_DUP_ENTRY: Duplicate entry '1' for key 'product.ProductId'") {

//         return res.json({ sucess: "false", message: "Product already there" });
//     }
//     res.json({ sucess: "true" })
// }
// this is mongo

module.exports.addProduct = async (req, res) => {
    const err = { ProductName: "", ProductPrice: "", Category: "" };
    try {
        const imagePath = req.img;
        console.log(imagePath);
        const data = new productModle(req.body);
        console.log(data);
        if (data?.ProductName && data?.ProductPrice && data?.Category[0]?.split(" ")?.join("").length > 1) {
            // console.log(data?.Category?.length);
            const result = await data.save();
            return res.json({ sucess: "True", data });
        }
        else {
            // console.log(data?.Category[0]?.length);
            // console.log(data?.Category.length);
            if (!data?.ProductName) {
                err.ProductName = "Enter Product name";
            }
            if (!data?.ProductPrice) {
                err.ProductPrice = "Enter Product Price";
            }
            if (!(data?.Category[0]?.length > 1) || !(data?.Category.length > 1)) {
                err.Category = "Enter the Product Category";
            }
            return res.json({ sucess: "False", err });
        }
    }
    catch (err) {
        console.log(err?.message);
        res.send(err?.errors);
    }
}

module.exports.fileUpload = (req, res) => {

    res.send("hlo");
}

// home page

module.exports.homepage_get = (req, res) => {
    res.json({ Id: "2@#g", ProductName: "Clothes", Productimg: "/img/?", Price: "50%" });
}