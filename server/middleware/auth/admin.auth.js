const UserService = require('../../dbservice/UserService');

module.exports = async function (req, res, next) {
    try {
        // Get user information by Id
        // User.role = 2 (admin)
        UserService.getUserInfoById(req.user.id).then((data) => {
            if (data[0].role !== 2) {
                return res.status(403).json({
                    error: true,msg: 'Admin resources access denied',
                });
            }

            next();
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};
