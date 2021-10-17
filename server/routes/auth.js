const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');
const upload = require('../utils/multer');
const ApiUser = require('../controllers/ApiUser');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
    upload.single('imageUrl'),
    [
        check('lastName', 'Không được bỏ trống tên').not().isEmpty(),
        check('email', 'Địa chỉ email không hợp lệ').isEmail(),
        check('password', 'Vui lòng điền mật khẩu nhiều hơn 6 kí tự').isLength({
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
        check('password', 'Vui lòng điền mật khẩu nhiều hơn 6 kí tự').isLength({
            min: 6,
        }),
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
router.post('/forgotPassword', ApiUser.forgotPassword);

// @route   POST api/auth/resetPassword/:token
// @desc    reset user password
// @access  Public
router.post('/resetPassword/:token', ApiUser.resetPassword);

module.exports = router;
