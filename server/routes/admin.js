const express = require('express');
const router = express.Router();
const ApiUser = require('../controllers/ApiUser');
const auth = require('../middleware/auth/auth');
const admin = require('../middleware/auth/admin.auth');
// @route   DELETE api/user/delete/:userId
// @desc    Delete user by admin
// @access  Private
router.delete('/delete/:userId', auth, admin, ApiUser.deleteUser);

module.exports = router;
