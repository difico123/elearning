const UserService = require('../dbservice/UserService');

module.exports = async function (req, res, next) {
    try {
        // Get user information by Id
        // User.role = 1 (instructor)
        UserService.getUserInfoById(req.user.id).then((data) => {
            if (data[0].role >= 3 && data[0].role <= 1) {
                return res.status(403).json({
                    error: 'Instructor resources access denied',
                });
            }

            next();
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};
