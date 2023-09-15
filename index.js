const express = require('express');
const dotenv = require('dotenv');
const route = require('./routes/routes');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();


app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

dotenv.config();

const PORT = process.env.PORT || 4500;

app.use(route);

app.listen(PORT, 'localhost', () => {
    console.log(`Server running on PORT ${PORT}`);
})