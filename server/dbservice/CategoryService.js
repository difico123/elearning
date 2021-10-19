const pool = require('../config/db/db');

module.exports = class CategoryService {
    static async getCategory() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select ca.id as categoryId, ca.name as categoryName, ' +
                    'count(c.id) as courseNum,count(uc.id) as register, ' +
                    ' round(avg(uc.rating),1) as rating ' +
                    'from courses c join categories ca on ca.id = c.category ' +
                    'join user_courses uc on uc.course = c.id group by ca.id';

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
