const NotificationService = require('../dbservice/NotificationService');

module.exports = class ApiNotification {

    // @route   GET api/notification/get
    // @desc    get notification by user
    // @access  Private
    static getNotification(req, res) {
        try {
            NotificationService.getNotification(req.user.id).then((data) => {
                if (data.length == 0) {
                    return res
                        .status(400)
                        .json({ error: 'Bạn không có thông báo nào' });
                }
                res.status(200).json(data);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};