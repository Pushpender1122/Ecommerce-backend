const express = require('express');
const authcontrol = require('../controller/authcontroll');
const routes = express();
const upload = require('../middleware/fileupl');
const middlewares = require('../middleware/privateroute');
const uploadUserProfile = require('../middleware/userprofileupload');
// login page
routes.use(express.json());

// user
// routes.get('/auth/user/login', authcontrol.login_get);
routes.post('/auth/user/login', authcontrol.login_post);
// routes.get('/auth/user/signup', authcontrol.signup_get);
routes.post('/auth/user/signup', authcontrol.signup_post);
routes.put('/auth/user/updatePassword', middlewares.checkjwt, authcontrol.updatePassword);
routes.get('/auth/user/profile/:id', middlewares.checkjwt, authcontrol.getprofile);
routes.post('/auth/user/profile/:id/editprofile', uploadUserProfile, authcontrol.editProfile);
routes.get('/auth/user/logout', middlewares.checkjwt, authcontrol.logout);

// admin page
routes.get('/auth/admin/Check', middlewares.AdminRoute, authcontrol.dashboard);
routes.get('/auth/user/profile', middlewares.AdminRoute, authcontrol.getprofile);
routes.post('/auth/admin/addproduct', upload, middlewares.AdminRoute, authcontrol.addProduct);
routes.put('/auth/admin/updateproduct/:id', middlewares.AdminRoute, authcontrol.updateproduct);
routes.delete('/auth/admin/deleteprodcut/:id', middlewares.AdminRoute, authcontrol.deleteprodcut);
// file upload
// routes.post('/auth/admin/fileupload', authcontrol.fileUpload);

//getProduct

routes.get('/productList', authcontrol.allproductList)
routes.get('/product/:?', authcontrol.Oneproduct);
routes.post('/cartList', authcontrol.CartProductList);


// home page

routes.get('/', authcontrol.homepage_get);

module.exports = routes;