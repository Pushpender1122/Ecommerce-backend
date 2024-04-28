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
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 hour
        sameSite: 'Lax' // Set SameSite attribute to 'Strict'
    }
    // cookie: { secure: true } 
}));
app.use(cookieParser());
app.use(express.static('uploads'));
app.use(flash());
app.use(express.json());
app.use(cors({
    origin: 'https://quickcyberecom.netlify.app', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://quickcyberecom.netlify.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
dotenv.config();

const PORT = process.env.PORT || 4500;

app.use(route);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})