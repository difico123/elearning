const pool = require('../config/db/db');

module.exports = class NotificationService {
    static async getCategory() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select ca.id, ca.name, COUNT(uc.id) as studentNum from categories ca ' +
                    'join courses c on c.category = ca.id ' +
                    'join user_courses uc on uc.course = c.id ' +
                    'GROUP by ca.id; ';

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
