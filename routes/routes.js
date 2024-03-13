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
routes.post('/auth/user/profile/:id/edit/profileimage', uploadUserProfile, middlewares.checkjwt, authcontrol.editProfile);
routes.post('/auth/user/profile/:id/edit/profile/details', middlewares.checkjwt, authcontrol.updateUserDetails);
routes.post('/auth/user/profile/:id/edit/profile/address', middlewares.checkjwt, authcontrol.updateOrDeleteAdress);
routes.get('/auth/user/logout', middlewares.checkjwt, authcontrol.logout);

// admin page
routes.get('/auth/admin/Check', middlewares.AdminRoute, authcontrol.dashboard);
routes.get('/auth/user/profile/:id', middlewares.AdminRoute, authcontrol.getprofile);
routes.get('/auth/admin/allorders', middlewares.AdminRoute, authcontrol.allorders);
routes.post('/auth/admin/addproduct', upload, middlewares.AdminRoute, authcontrol.addProduct);
routes.put('/auth/admin/updateproduct/:id', middlewares.AdminRoute, authcontrol.updateproduct);
routes.delete('/auth/admin/deleteprodcut/:id', middlewares.AdminRoute, authcontrol.deleteprodcut);
// file upload
// routes.post('/auth/admin/fileupload', authcontrol.fileUpload);

//getProduct

routes.get('/productList', authcontrol.allproductList)
routes.get('/product/:?', authcontrol.Oneproduct);
routes.post('/cartList', authcontrol.CartProductList);

//ORDERS
routes.post('/auth/user/profile/:id/orders/createorder', authcontrol.createOrders);
routes.get('/auth/user/profile/:id/orders', authcontrol.userOrder);
// home page
routes.get('/', authcontrol.homepage_get);

module.exports = routes;