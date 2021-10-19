const CategoryService = require('../dbService/CategoryService');

module.exports = class ApiNotification {
    // @route   GET api/category/get
    // @desc    get category
    // @access  Public
    static getCategory(req, res) {
        try {
            CategoryService.getCategory().then((data) => {
                if (data.length == 0) {
                    return res.status(400).json({ error: true,msg: 'Rỗng' });
                }
                res.status(200).json({error: false, data});
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
