const { model } = require('mongoose');
const dbcmd = require('../db/dbcmd');
const Productdb = require('../db/productdb');
const productModle = require('../db/productSchema');
const bcrypt = require('../db/bcrypt');
const jwt = require('../jwt/jwt');
// var cookie = require('cookie');
module.exports.login_get = (req, res) => {

    res.send('Login get');
}
module.exports.login_post = async (req, res) => {
    const { email, password } = (req.body && req.body.data) || {};
    // const { email, password } = req.body?.data;
    var check = await dbcmd.findEmail(email);
    if (check) {
        check = await dbcmd.getPassword(email, password);
        if (check) {
            const token = await jwt.createjwt(email);
            res.cookie('jwt', token, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                // domain: 'localhost', // Replace 'localhost' with your desired domain
                secure: false
            });
            // res.setHeader('Set-Cookie', cookie.serialize('jwt', String(jwt), {
            //     httpOnly: true,
            //     maxAge: 1000 * 60 * 60
            // }));
            req.flash("email", email);
            res.json({ message: "Succesfull login", token });
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
    const { name, email, password } = req.body.data || [];
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
module.exports.updatePassword = async (req, res) => {
    try {
        // console.log(req.body);
        const email = req.flash("email")[0] || '';
        const newPAss = req.body.Newpassword;
        const data = await dbcmd.getPassword(email, req.body?.Password);
        // console.log("data is " + data);
        console.log(email, newPAss, data);
        if (data) {
            const hash = await bcrypt.createHash(newPAss);
            const NewPassFlag = await dbcmd.updatePassword(email, hash);
            res.json(NewPassFlag);
        }
        else {
            req.json({ success: "false", data: data });
        }
    } catch (error) {
        res.json({ success: "false", error })
    }
}
module.exports.getprofile = (req, res) => {
    // res.send(req.flash("email")[0]);
    // console.log(req.);
    res.send("Hlo");
}
module.exports.logout = (req, res) => {
    res.clearCookie("jwt").status(200).json({ message: "Successfully logged out" });
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
        const imagePath = req.img.replace(/\\/g, '/').replace('uploads/', '');
        // console.log(imagePath);
        const data = new productModle(req.body);
        // console.log(data);
        if (data?.ProductName && data?.ProductPrice && data?.Category[0]?.split(" ")?.join("").length > 1) {
            // console.log(data?.Category?.length);
            const result = await data.save();
            let user = await productModle.findOne({
                _id: result._id
            })
            user.img.push(imagePath);
            await user.save();
            return res.json({ success: "True", data });
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
            return res.json({ success: "False", err });
        }
    }
    catch (err) {
        console.log(err?.message);
        res.send(err?.errors);
    }
}

module.exports.updateproduct = async (req, res) => {
    const id = req.query.id;
    try {
        // console.log(id);
        // console.log(req.body);
        const data = await productModle.updateOne(
            { _id: id },
            {
                $set: { ProductPrice: req.body?.ProductPrice, ProductName: req.body?.ProductName, Description: req.body?.Description, Stock: req.body?.Stock }
            }
        )
        // console.log(data);
        res.send(data);
    }
    catch (err) {
        console.log(err.message);
        res.send("err");
    }
}
module.exports.deleteprodcut = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await productModle.deleteOne(
            {
                _id: id
            }
        )
        if (data.deletedCount == 0) {
            return res.json({ success: "false", message: "Product Does not exist" });
        }
        // console.log(data);
        res.json({ success: "true", message: "Product deleted Success" });
    } catch (err) {
        console.log(err.message);
        res.send("err");
    }

}
//Get Product

module.exports.allproductList = async (req, res) => {
    try {
        const data = await productModle.find({
            // ProductName: req.body.ProductName,
        })
        // console.log(data);
        if (data.length > 0) {
            res.json(data);
        }
        else {
            res.send("No Product ");
        }
    }
    catch (err) {
        console.log(err.message);
        res.send("Err");
    }

}
module.exports.Oneproduct = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        console.log(req.cookies);
        // res.send("H");
        const data = await productModle.findById(id).exec();
        res.json(data);
    }
    catch (err) {
        console.log(err.message);
        res.send("err");
    }
}
module.exports.CartProductList = async (req, res) => {
    const CartItemsId = req.body;
    try {
        const promises = CartItemsId.map(async (element) => {
            return await productModle.findById(element.id).exec();
        });

        const responceObject = await Promise.all(promises);

        // Rearrange the responses according to the original order
        const orderedResponse = CartItemsId.map((element) => {
            const found = responceObject.find((item) => item._id.equals(element.id));
            return found;
        });

        res.json(orderedResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports.fileUpload = (req, res) => {
    console.log(req.flash("test"));
    res.send("hlo");
}

// home page

module.exports.homepage_get = (req, res) => {
    res.json({ Id: "2@#g", ProductName: "Clothes", Productimg: "/img/?", Price: "50%" });
}