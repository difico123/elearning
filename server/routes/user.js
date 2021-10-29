const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');
const { checkInputTitle } = require('../middleware/errors/checkInput');
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
    checkInputTitle('lastName', 'Tên', 3, 10),
    checkInputTitle('middleName', 'Tên đệm', 3, 10),
    checkInputTitle('firstName', 'Họ', 3, 10),
    checkInputTitle('phoneNumber', 'Số đIện thoại', 9, 12),
    checkInputTitle('address', 'Địa chỉ', 5, 30),
    checkInputTitle('city', 'Thành phố', 5, 30),
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
    [
        check('newPassword', 'Vui lòng điền mật khẩu mới nhiều hơn 6 kí tự')
            .custom((value) => !/\s/.test(value))
            .isLength({
                min: 6,
            }),
        check('password', 'Vui lòng điền mật khẩu xác nhận nhiều hơn 6 kí tự')
            .custom((value) => !/\s/.test(value))
            .isLength({
                min: 6,
            }),
    ],
    auth,
    ApiUser.editPw,
);

module.exports = router;
