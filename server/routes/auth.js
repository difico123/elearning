const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');
const upload = require('../utils/multer');
const ApiUser = require('../controllers/ApiUser');
const {
    checkInputTitle,
    checkAddressInput,
} = require('../middleware/errors/checkInput');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
    upload.single('imageUrl'),
    [
        checkInputTitle('lastName', 'Tên', 1, 10),
        checkInputTitle('middleName', 'Tên đệm', 1, 10),
        checkInputTitle('firstName', 'Họ', 1, 10),
        check(
            'phoneNumber',
            'Số điện thoại phải chứa số, không có ký tự đặc biệt',
        )
            .custom((value) => /^\d+$/.test(value))
            .isLength({
                min: 6,
                max: 10,
            })
            .withMessage('Số điện thoại phải chứa từ 6 - 10 ký tự'),
        checkAddressInput('address', 'Tên địa chỉ', 1, 30),
        checkAddressInput('city', 'Tên thành phố', 1, 20),

        check('email', 'Địa chỉ email không hợp lệ').isEmail(),
        check('password', 'Vui lòng điền mật khẩu nhiều hơn 6 kí tự')
            .custom((value) => !/\s/.test(value))
            .isLength({
                min: 6,
            }),
    ],
    validateInput,
    ApiUser.register,
);

// @route   POST api/auth/login
// @desc    login user
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Địa chỉ email không hợp lệ').isEmail(),
        check('password')
            .custom((value) => !/\s/.test(value))
            .withMessage('Mật khẩu không được chứa khoảng trắng')
            .isLength({
                min: 6,
            })
            .withMessage('Mật khẩu dài ít nhất 6 ký tự'),
    ],
    validateInput,
    ApiUser.login,
);

// @route   GET api/auth/logout
// @desc    logout user
// @access  private
router.get('/logout', ApiUser.logout);

// @route   POST api/auth/forgotPassword
// @desc    forgot user password
// @access  Public
router.post(
    '/forgotPassword',
    [check('email', 'Địa chỉ email không hợp lệ').isEmail()],
    validateInput,
    ApiUser.forgotPassword,
);

// @route   POST api/auth/resetPassword/:token
// @desc    reset user password
// @access  Public
router.post(
    '/resetPassword/:token',
    [
        check('newPassword', 'Vui lòng điền mật khẩu mới nhiều hơn 6 kí tự')
            .custom((value) => !/\s/.test(value))
            .isLength({
                min: 6,
            }),
        check(
            'confirmPassword',
            'Vui lòng điền mật khẩu xác nhận nhiều hơn 6 kí tự',
        )
            .custom((value) => !/\s/.test(value))
            .isLength({
                min: 6,
            }),
    ],
    validateInput,
    ApiUser.resetPassword,
);

module.exports = router;
