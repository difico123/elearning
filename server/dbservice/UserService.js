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
    static async getUserByResetPasswordToken(resetPasswordToken) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query =
                    'SELECT * FROM users WHERE resetPasswordToken = ?';

                pool.query(query, [resetPasswordToken], (err, result) => {
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
            const response = await new Promise((resolve, reject) => {
                let query = 'UPDATE users SET ? WHERE id = ?';
                pool.query(query, [user, user.id], (err, result) => {
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

    static async showAvt(id) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query = 'SELECT imageUrl FROM users WHERE id = ?';

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

    static async listUsers() {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM users where role != 2';

                pool.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return respond;
        } catch (error) {
            console.log(error);
        }
    }
};
