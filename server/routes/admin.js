const express = require('express');
const router = express.Router();
const ApiAdmin = require('../controllers/ApiAdmin');
const auth = require('../middleware/auth/auth');
const admin = require('../middleware/auth/admin.auth');

// @route   DELETE api/user/deleteUser/:userId
// @desc    Delete user by admin
// @access  Private
router.delete('/deleteUser/:userId', auth, admin, ApiAdmin.deleteUser);

// @route   DELETE api/admin/deleteCourse/:courseId
// @desc    Delete course by admin
// @access  Private
router.delete('/deleteCourse/:courseId', auth, admin, ApiAdmin.deleteCourse);

// @route   GET api/user/listUsers
// @desc    get users by admin
// @access  Private
router.get('/listUsers', auth, admin, ApiAdmin.listUsers);

// @route   GET api/user/listCourses
// @desc    get listCourses by admin
// @access  Private
router.get('/listCourses', auth, admin, ApiAdmin.listCourses);

module.exports = router;
