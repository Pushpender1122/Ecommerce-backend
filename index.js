const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4500;

app.get('/', (req, res) => {
    res.send("Hlo");
})

app.listen(PORT, 'localhost', () => {
    console.log(`Server running on PORT ${PORT}`);
})