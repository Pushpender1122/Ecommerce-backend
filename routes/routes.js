const express = require('express');
const authcontrol = require('../controller/authcontroll');
const routes = express();
const upload = require('../middleware/fileupl');
const middlewares = require('../middleware/privateroute');
// login page
routes.use(express.json());

// user
// routes.get('/auth/user/login', authcontrol.login_get);
routes.post('/auth/user/login', authcontrol.login_post);
// routes.get('/auth/user/signup', authcontrol.signup_get);
routes.post('/auth/user/signup', authcontrol.signup_post);
routes.put('/auth/user/updatePassword', authcontrol.updatePassword);
routes.get('/auth/user/profile', middlewares.checkjwt, authcontrol.getprofile);


// admin page
routes.post('/auth/admin/addproduct', upload, authcontrol.addProduct);
routes.put('/auth/admin/updateproduct/:id', authcontrol.updateproduct);
routes.delete('/auth/admin/deleteprodcut/:id', authcontrol.deleteprodcut);
// file upload
// routes.post('/auth/admin/fileupload', authcontrol.fileUpload);

//getProduct

routes.get('/productList', authcontrol.allproductList)
routes.get('/product/:?', authcontrol.Oneproduct);
routes.post('/cartList', authcontrol.CartProductList);


// home page

routes.get('/', authcontrol.homepage_get);

module.exports = routes;