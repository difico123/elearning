const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ApiUser = require('../controllers/ApiUser');
const auth = require('../middleware/auth/auth');
const admin = require('../middleware/auth/admin.auth');
const validateInput = require('../middleware/errors/validateInput');

// @route   GET api/user/info
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
// @route   POST api/user/logout
// @desc    logout user
// @access  private
router.post('/logout', (req, res) => {
    res.send('logout');
});

// @route   PUT api/user/editInfo
// @desc    Edit user information
// @access  Private
router.put(
    '/editInfo',
    [check('lastName', 'Không được bỏ trống tên').not().isEmpty()],
    auth,
    validateInput,
    ApiUser.editInfo,
);

// @route   DELETE api/user/delete/:userId
// @desc    Delete user by admin
// @access  Private
router.delete('/delete/:userId', auth, admin, ApiUser.deleteUser);

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
router.put('/editPw', auth, ApiUser.editPw);

module.exports = router;
