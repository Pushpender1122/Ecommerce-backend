const express = require('express');
const dotenv = require('dotenv');
const route = require('./routes/routes');
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

// const jwt = require('./jwt/jwt');
app.use(session({
    secret: 'RandomTExtFOrHa23!@3',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true } 
}));
app.use(cookieParser());
app.use(express.static('uploads'));
app.use(flash());
app.use(express.json());
app.use(cors({
    origin: 'http://192.168.161.10:3000', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
dotenv.config();

const PORT = process.env.PORT || 4500;

app.use(route);

app.listen(PORT, '192.168.161.10', () => {
    console.log(`Server running on PORT ${PORT}`);
})