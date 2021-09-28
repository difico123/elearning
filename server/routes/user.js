const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ApiUser = require('../controllers/ApiUser');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin.auth');

// @route   POST api/user
// @desc    User information
// @access  Private
router.get('/info', auth, ApiUser.getInfor);

// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post(
    '/resgister',
    [
        check('lastName', 'Không được bỏ trống tên').not().isEmpty(),
        check('email', 'Địa chỉ email không hợp lệ').isEmail(),
        check('password', 'Vui lòng điền mật khẩu nhiều hơn 6 kí tự').isLength({
            min: 6,
        }),
    ],
    ApiUser.resgister,
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
    ApiUser.login,
);

// @route   PUT api/user/editInfo
// @desc    Edit user information
// @access  Private
router.put(
    '/editInfo',
    auth,
    [
        check('lastName', 'Không được bỏ trống tên').not().isEmpty(),
        check('email', 'Địa chỉ email không hợp lệ').isEmail(),
    ],
    ApiUser.editInfo,
);

// @route   DELETE api/user/delete
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
