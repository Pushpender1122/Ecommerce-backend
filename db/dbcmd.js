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
module.exports.getPassword = async (email, password) => {
    try {

        const hashPass = await new Promise((resolve, reject) => {
            connection.query(`select password from users where email = "${email}"`, (err, data) => {
                if (err) {
                    console.log(err.message);
                    reject(err.message);
                }
                else {
                    // console.log(data);
                    // console.log(data[0].password);
                    if (data[0]?.password) {
                        // return;
                        resolve(data[0]?.password);
                        return
                    }
                    resolve(null);
                    // console.log("not");

                }
            })
        });
        if (hashPass != null) {

            const Check = await bcrypt.checkPassword(password, hashPass);
            console.log(Check);
            return Check;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.UpdataPassword = async (email, hash) => {
    const result = await new Promise((res, rej) => {
        connection.query(`update users set password ='${hash}' where email ='${email}' `, (err, data) => {

            if (err) {
                console.log(err);
                rej(err);
                return;
            }
            // console.log(data);
            res("True");
        })
    });
    return result;
}
module.exports.getId = async (email) => {
    const user_id = await new Promise((res, rej) => {
        connection.query(`select * from users where email='${email}'`, (err, data) => {
            if (err) {
                rej(err.message);
                console.log(err.message);
                return;
            }
            res(data[0].ID);
        })
    })
    console.log("user Id " + user_id);
    return user_id;
}