const pool = require('../config/db/db');

module.exports = class UserService {
    static async getUserByEmail(email) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM users WHERE email = ?';

                pool.query(query, [email], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return respond;
        } catch (error) {
            console.log(error);
        }
    }

    static async addUser(user) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO users SET ? ';

                pool.query(query, [user], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async getUserInfoById(id) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM users WHERE id = ?';

                pool.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return respond;
        } catch (error) {
            console.log(error);
        }
    }

    static async updateUserInfo(user) {
        try {
            const {
                id,
                firstName,
                middleName,
                lastName,
                email,
                phoneNumber,
                address,
                city,
            } = user;
            const response = await new Promise((resolve, reject) => {
                //check if email exists
                let firstToken =
                    'UPDATE users SET ' +
                    'firstName = ?,' +
                    'middleName = ?,' +
                    'lastName = ?,';

                let secondToken =
                    'phoneNumber = ?,' +
                    'address = ?,' +
                    'city = ?' +
                    'WHERE id = ?';
                let query = '';
                let questionMark = [];
                const emailString = 'email = ?,';
                if (email) {
                    query += firstToken + emailString + secondToken;
                    questionMark = [
                        firstName,
                        middleName,
                        lastName,
                        email,
                        phoneNumber,
                        address,
                        city,
                        id,
                    ];
                } else {
                    query += firstToken + secondToken;
                    questionMark = [
                        firstName,
                        middleName,
                        lastName,
                        phoneNumber,
                        address,
                        city,
                        id,
                    ];
                }
                pool.query(query, questionMark, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async deleteUserById(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM users WHERE id = ?';

                pool.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
};
