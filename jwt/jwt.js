const jwt = require('jsonwebtoken');
const dbcmd = require('../db/dbcmd');
const key = process.env.SECRETKEY;

module.exports.createjwt = async (email) => {
    try {
        const user_id = await dbcmd.getId(email);
        const token = jwt.sign({ user_id }, key, { expiresIn: '1h' }); // Signing the user_id payload

        return token;
    } catch (err) {
        console.log(err.message);
        throw new Error('Failed to create JWT token');
    }
};

