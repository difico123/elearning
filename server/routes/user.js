const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');
const {
    checkInputTitle,
    checkAddressInput,
} = require('../middleware/errors/checkInput');
const ApiUser = require('../controllers/ApiUser');
const auth = require('../middleware/auth/auth');
const upload = require('../utils/multer');

// @route   GET api/user/info
// @desc    User information
// @access  Private
router.get('/info', auth, ApiUser.getInfor);

// @route   PUT api/user/editInfo
// @desc    Edit user information
// @access  Private
router.put(
    '/editInfo',
    upload.single('imageUrl'),
    checkInputTitle('lastName', 'Tên', 1, 10),
    checkInputTitle('middleName', 'Tên đệm', 1, 10),
    checkInputTitle('firstName', 'Họ', 1, 10),
    check('phoneNumber', 'Số điện thoại phải chứa số, không có ký tự đặc biệt')
        .custom((value) => /^\d+$/.test(value))
        .isLength({
            min: 6,
            max: 10,
        })
        .withMessage('Số điện thoại phải chứa từ 6 - 10 ký tự'),
    checkAddressInput('address', 'Tên địa chỉ', 1, 30),
    checkAddressInput('city', 'Tên thành phố', 1, 20),
    auth,
    validateInput,
    ApiUser.editInfo,
);

// @route   PUT api/user/beInstructor
// @desc    to be an instructor
// @access  Private
router.put('/beAnInstructor', auth, ApiUser.beAnInstructor);

// @route   GET api/user/showAvt/:userId
// @desc    show user avatar by user id
// @access  Public
router.get('/showAvt/:userId', ApiUser.showAvt);

// @route   PUT api/user/editPw
// @desc    edit user password
// @access  private
router.put(
    '/editPw',
    auth,
    check('password')
        .custom((value) => !/\s/.test(value))
        .withMessage('Mật khẩu cũ không được chứa khoảng trắng')
        .isLength({
            min: 6,
        })
        .withMessage('Mật khẩu cũ phải dài hơn 6 kí tự'),
    validateInput,
    ApiUser.checkCorrectPassword,
    [
        check('newPassword')
            .custom((value) => !/\s/.test(value))
            .withMessage('Mật khẩu mới không được chứa khoảng trắng')
            .isLength({
                min: 6,
            })
            .withMessage('Mật khẩu mới phải dài hơn 6 kí tự'),

        check('confirmPassword')
            .custom((value) => !/\s/.test(value))
            .withMessage('Mật khẩu xác nhận không được chứa khoảng trắng')
            .isLength({
                min: 6,
            })
            .withMessage('Mật khẩu xác nhận phải dài hơn 6 kí tự'),
    ],
    validateInput,
    ApiUser.editPw,
);

module.exports = router;
