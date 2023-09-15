const express = require('express');
const authcontrol = require('../controller/authcontroll');
const routes = express();


routes.get('/auth/user/login', authcontrol.login_get);
routes.post('/auth/user/login', authcontrol.login_post);
routes.get('/auth/user/signup', authcontrol.signup_get);
routes.post('/auth/user/signup', authcontrol.signup_post);

module.exports = routes;