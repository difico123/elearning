const pool = require('../config/db/db');

module.exports = class NotificationService {

    static async getCategory() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'SELECT * FROM categories ';

                pool.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
};
