const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ApiUser = require('../controllers/ApiUser');
const auth = require('../middleware/auth/auth');
const admin = require('../middleware/auth/admin.auth');
const validateInput = require('../middleware/errors/validateInput');

// @route   GET api/user
// @desc    User information
// @access  Private
router.get('/info', auth, ApiUser.getInfor);

// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
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

// @route   POST api/user/login
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

// @route   PUT api/user/editInfo
// @desc    Edit user information
// @access  Private
router.put(
    '/editInfo',
    [
        check('lastName', 'Không được bỏ trống tên').not().isEmpty(),
        check('email', 'Địa chỉ email không hợp lệ').isEmail(),
    ],
    auth,
    validateInput,
    ApiUser.editInfo,
);

// @route   DELETE api/user/delete
// @desc    Delete User by admin
// @access  Private
router.delete('/delete/:id', auth, admin, ApiUser.deleteUser);

// @route   PUT api/user/beIntructor
// @desc    to be an instructor
// @access  Private
router.put('/beAnIntructor', auth, ApiUser.beAnIntructor);

module.exports = router;
