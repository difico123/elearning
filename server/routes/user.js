const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ApiUser = require('../controllers/ApiUser');
const auth = require('../middleware/auth/auth');
const admin = require('../middleware/auth/admin.auth');
const validateInput = require('../middleware/errors/validateInput');

// @route   GET apis/user
// @desc    User information
// @access  Private
router.get('/info', auth, ApiUser.getInfor);

// @route   POST api/users/register
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
    ApiUser.resgister,
);

// @route   POST api/users/login
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

// @route   PUT api/users/editInfo
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

// @route   DELETE api/users/delete
// @desc    Delete User by admin
// @access  Private
router.delete('/delete/:id', auth, admin, ApiUser.deleteUser);

// router.get('/', function (req, res) {
//     pool.query('select * from my_db.users', function (error, results, fields) {
//         if (error) throw error;
//         return res.send({
//             error: false,
//             data: results,
//             message: 'users list.',
//         });
//     });
// });

// router.get('/:id', function (req, res) {
//     id = req.params.id;
//     pool.query(
//         'select * from users where id = ' + id,
//         (error, results, fields) => {
//             if (error) throw error;
//             return res.send({ error: false, data: results, message: 'users.' });
//         },
//     );
// });

// router.post('/add', (req, res, next) => {
//     let { name } = req.body;
//     let { email } = req.body;
//     pool.query(
//         `INSERT INTO users (name,email) value ('${name}','${email}')`,
//         (error, results, fields) => {
//             if (error) throw error;
//             return res.send(`create user name: ${name} successfully`);
//         },
//     );
// });

// router.delete('/delete/:id', (req, res, next) => {
//     let { id } = req.params;
//     pool.query(
//         `DELETE FROM users WHERE id=${id};`,
//         function (error, results, fields) {
//             if (error) throw error;
//             return res.send(`delete id ${id} successfully`);
//         },
//     );
// });

// router.put('/update/:id', (req, res, next) => {
//     let { id } = req.params;
//     let { name, email } = req.body;
//     pool.query(
//         `UPDATE users SET name='${name}',email='${email}' WHERE id=${id}`,
//         (error, results, fields) => {
//             if (error) throw error;
//             return res.send(`update id ${id} successfully`);
//         },
//     );
// });

module.exports = router;
