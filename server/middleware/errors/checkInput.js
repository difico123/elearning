const { check } = require('express-validator');

module.exports = {
    checkInputTitle: function (field, object, min, max) {
        return check(`${field}`)
            .escape()
            .notEmpty()
            .withMessage(`${object} không được bỏ trống`)
            .isLength({ min: min || 3, max: max || 10 })
            .withMessage(
                `${object} phải chứa từ ${min || 3} - ${max || 10} kí tự`,
            )
            .matches(/^[A-Za-z| .,!'&+]+$/)
            .withMessage(`${object} không được chứa kí tự đặc biệt`)
            .custom((value) => !/\s/.test(value))
            .withMessage(`${object} không được có dấu cách`);
    },
    checkAddressInput: function (field, object, min, max) {
        return check(`${field}`)
            .escape()
            .notEmpty()
            .withMessage(`${object} không được bỏ trống`)
            .isLength({ min: min || 3, max: max || 10 })
            .withMessage(
                `${object} phải chứa từ ${min || 3} - ${max || 10} kí tự`,
            )
            .matches(/^[A-Za-z0-9| .,'!&+]+$/)
            .withMessage(`${object} không được chứa kí tự đặc biệt`);
    },
};
