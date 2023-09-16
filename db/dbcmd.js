const connection = require('../db/db');
const bcrypt = require('./bcrypt');

const createTableCmd = `Create table if not EXISTS users (
    ID varchar(255),
    Name varchar(255),
    Email varchar(255) PRIMARY KEY,
    Password varchar(255)
);`;

module.exports.createTable = () => {
    try {
        connection.query(createTableCmd, (err) => {
            if (err) {
                console.log(err.message);
            }

        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports.findEmail = async (email) => {
    try {
        const data = await new Promise((resolve, reject) => {
            connection.query(`select email from users where email="${email}"`, (err, data) => {
                if (err) {
                    console.log(err.message);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        if (data.length > 0) {
            return 1;
        } else {
            return 0;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports.NewUser = async (name, email, password) => {
    try {
        const hashPassword = await bcrypt.createHash(password);
        const data = await new Promise((res, rej) => {
            connection.query(`insert into users (id,name,email,password) values(UUID(),"${name}","${email}","${hashPassword}")`, (err, data) => {
                if (err) {
                    console.log(err.message);
                    rej(err);
                }
                else {
                    // console.log(Object.values(data)[1]);
                    res(Object.values(data)[1]);
                }
            })
        });
        if (data == 1) {

            return 1;
        }
        else {
            return 0;
        }
    }
    catch (err) {
        console.log(err);
    }
}

