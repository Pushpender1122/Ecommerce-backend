const { model } = require('mongoose');
const dbcmd = require('../db/dbcmd');
// const Productdb = require('../db/productdb');
const productModle = require('../db/productSchema');
const bcrypt = require('../db/bcrypt');
const jwt = require('../jwt/jwt');
const { uploadToCloudinary } = require('../utility/cloudinary');
const User = require('../db/userSchema');
const Order = require('../db/orderSchema');
const { response } = require('../routes/routes');
// var cookie = require('cookie');

module.exports.login_get = (req, res) => {

    res.send('Login get');
}
module.exports.login_post = async (req, res) => {
    var { email, password } = (req.body && req.body.data) || {};
    // const { email, password } = req.body?.data;
    email = email?.toLowerCase();
    var check = await dbcmd.findEmail(email);
    if (check) {
        check = await dbcmd.getPassword(email, password);
        if (check) {
            var id = await dbcmd.getId(email);
            const token = await jwt.createjwt(email);
            const user = await dbcmd.getuserdetails(id);
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
            res.json({ message: "Succesfull login", userRole: user.role, userId: user._id });
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
    var { name, email, password } = req.body.data || [];
    var message = { Name: "", Email: "", Password: "" };

    console.log(name, email, password);
    email = email.toLowerCase();
    // Validate email using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name?.length < 3) {
        message.Name = "Name should contain at least 3 characters";
    }
    if (!email || email?.length < 1) {
        message.Email = "Please enter an email";
    } else if (!emailRegex.test(email)) {
        message.Email = "Invalid email format";
    }
    if (!password || password?.length < 1) {
        message.Password = "Password must be longer than 1 character";
    }

    if (name?.length >= 3 && emailRegex.test(email) && password?.length >= 1) {
        let Check = await dbcmd.findEmail(email);
        if (Check) {
            res.json({ message: "User Already exists" });
        } else {
            Check = await dbcmd.NewUser(name, email, password);
            if (Check) {
                res.json({ message: "User Created Successfully" });
            }
        }
    } else {
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
module.exports.getprofile = async (req, res) => {
    try {
        // Extracting ID from the path
        const id = req.path.split('/').pop();
        const userdetails = await dbcmd.getuserdetails(id);


        // console.log(userdetails);
        // Omitting the password field if it exists in userdetails
        if (userdetails && userdetails.password) {
            userdetails.password = undefined
        }
        // Sending a response
        res.json({ userdetails });
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
}
module.exports.editProfile = async (req, res) => {
    // console.log(req)
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const response = await uploadToCloudinary(req.file.path, req.file.filename);
        if (!response || !response.url) {
            throw new Error('Failed to upload to Cloudinary');
        }

        const ack = await dbcmd.updateProfileImage(response.url, req.params.id);
        if (!ack.acknowledged) {
            throw new Error('Failed to update profile image in the database');
        }

        res.json({ message: ack.acknowledged });
    } catch (error) {
        // console.error('Error:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }

}

module.exports.updateUserDetails = async (req, res) => {
    try {
        const { name, email, label, address } = req.body;
        const id = req.params.id;

        if (!name && !email && !label && !address) {
            return res.status(400).json({ message: "Provide the data " });
        }

        if (name && email) {

            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== id) {
                return res.status(400).json({ message: "Email already exists for another user" });
            }
            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (email) updatedFields.email = email;

            try {
                const result = await User.findByIdAndUpdate(
                    { _id: id },
                    updatedFields,
                    { new: true } // To get the updated document
                );

                if (!result) {
                    return res.status(404).json({ message: "User not found" });
                }

                // result.password = undefined;/
                return res.json({ message: "User details updated successfully" });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error updating user details", error });
            }
        }
        else {
            try {
                console.log(id);
                const user = await User.findById(id);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const newAddress = { label, address };
                user.addresses.push(newAddress);
                const result = await user.save();
                // result.password = undefined;
                return res.json({ message: "User address updated successfully" });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error updating user address", error });
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
};
module.exports.updateOrDeleteAdress = async (req, res) => {
    // console.log(req.body);
    try {
        const userId = req.params.id;
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ message: "User not found" });
            // console.log('User not found');
        }

        // Update the addresses in the user document
        user.addresses = req.body;
        // Save the updated user
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.json({ message: "Updated Succesfully", user: updatedUser });
        // console.log('User updated:', updatedUser);
    } catch (error) {
        console.log(error);
        return res.json({ message: "Error updating addresses" });
    }
}
module.exports.logout = (req, res) => {
    res.clearCookie("jwt").status(200).json({ message: "Successfully logged out" });
}
//orders
module.exports.createOrders = async (req, res) => {
    const id = req.params.id;
    if (!id) return res.json({ message: "Authentication Failed" });

    const data = req.body.data;
    console.log(id);
    console.log(data);
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (data.length <= 0) {
            return res.json({ message: "Add the Product in the Cart" });
        }
        const productOutOfStock = [];
        for (const element of data) {
            const product = await productModle.findById(element.id);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${element.id} not found` });
            }
            if (element.numberOfItems <= product.Stock) {
                const order = new Order({
                    userId: id,
                    items: {
                        productName: product.ProductName,
                        quantity: element.numberOfItems
                    }
                });
                await order.save();
                user.orders.push(order._id);

                product.Stock -= element.numberOfItems;
                await product.save();
            } else {
                productOutOfStock.push({ id: element.id, message: `This product (${product.ProductName}) has only ${product.Stock} in stock` });
            }
        }

        await user.save();

        if (productOutOfStock.length > 0) {
            return res.status(200).json({ message: "Some products are out of stock", productOutOfStock });
        }
        return res.json({ message: "Orders placed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating orders" });
    }
};

module.exports.allorders = async (req, res) => {
    const Allorder = await Order.find();
    res.json({ "order": Allorder });
}
module.exports.userOrder = async (req, res) => {
    const id = req.params.id;
    try {
        const orders = await Order.find({ userId: id });
        res.json({ "Orders": orders });
    } catch (error) {
        res.json({ "Error": error.message });
    }
    // console.log(id);
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
module.exports.dashboard = (req, res) => {
    res.json({ message: "Admin true" });
}
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
        res.send(err.message);
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

        const responseObject = await Promise.all(promises);

        // Rearrange the responses according to the original order
        const orderedResponse = CartItemsId.map((element) => {
            const found = responseObject.find((item) => item._id.equals(element.id));
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