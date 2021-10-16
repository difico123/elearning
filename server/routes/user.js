const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');
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
    [check('lastName', 'Không được bỏ trống tên').not().isEmpty()],
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
router.put('/editPw', auth, ApiUser.editPw);

module.exports = router;
