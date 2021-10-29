const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            msg: errors.errors.map((item) => item.msg),
        });
    }
    next();
};
