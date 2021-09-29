const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // encrypt password
const UserService = require('../dbservice/UserService');
const jwt = require('jsonwebtoken');

module.exports = class ApiUser {
    // @route   POST api/user/register
    // @desc    Register user
    // @access  Public
    static async resgister(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.errors.map((item) => item.msg),
            });
        }

        try {
            let { email } = req.body;

            let hasUser = UserService.getUserByEmail(email);

            hasUser
                .then(async (data) => {
                    if (data[0]) {
                        return res
                            .status(400)
                            .json({ error: 'Email này đã có người đăng kí' });
                    }

                    const salt = await bcrypt.genSalt(10);
                    let user = req.body;
                    let { password } = user;
                    user.password = await bcrypt.hash(password, salt);

                    UserService.addUser(user)
                        .then((created) => {
                            if(!created) {
                               return res.status(400).send(
                                    'Chưa đăng kí được tài khoản',
                                );
                            }
                            res.status(200).send(
                                'Đăng kí tài khoản thành công',
                            );
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        } catch (error) {
            res.status(500).send('server error ' + error.message);
        }
    }

    // @route   POST api/users/login
    // @desc    login user
    // @access  Public
    static async login(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.errors.map((item) => item.msg),
            });
        }
        let { email, password } = req.body;

        //find user
        UserService.getUserByEmail(email)
            .then(async (data) => {
                if (!data[0]) {
                    return res
                        .status(400)
                        .json({ error: 'Email này chưa được đăng kí' });
                }

                try {
                    //else Compare passwords
                    const isMatch = await bcrypt.compare(
                        password,
                        data[0].password,
                    );
                    if (!isMatch) {
                        return res.status(404).json({
                            error: 'Mật khẩu của bạn không chính xác',
                        });
                    }
                    //payload for jwt
                    const payload = {
                        user: {
                            id: data[0].id,
                        },
                    };

                    jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        {
                            expiresIn: 36000, // for development for production it will 3600
                        },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                            });
                        },
                    );
                } catch (error) {
                    console.log(error.message);
                    res.status(500).send('Server error');
                }
            })
            .catch((err) => console.log(err));
    }

    // @route   POST api/user
    // @desc    Get user information
    // @access  Private
    static async getInfor(req, res) {
        try {
            //get user information by id
            let { id } = req.user;
            UserService.getUserInfoById(id).then((data) => {
                res.json(data);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   PUT api/user/editInfo
    // @desc    Edit user information
    // @access  Private
    static async editInfo(req, res) {
        try {
            let { id } = req.user;
            UserService.getUserInfoById(id).then((data) => {
                if (!data[0]) {
                    return res
                        .status(400)
                        .json({ error: 'Không tìm thấy user' });
                }

                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        error: errors.errors.map((item) => item.msg),
                    });
                }

                const user = req.body;
                user.id = id;
                UserService.updateUserInfo(user).then((updated) => {
                    if (!updated) {
                        return res.status(400).json({
                            error: 'Không sửa được thông tin của bạn ',
                        });
                    }
                    res.status(200).send('Đã sửa thông tin của bạn ');
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   DELETE api/user/delete
    // @desc    Delete user by admin
    // @access  Private
    static async deleteUser(req, res) {
        try {
            //get user information by id
            let { id } = req.params;
            UserService.deleteUserById(id).then((data) => {
                if (!data) {
                    return res.status(400).json({
                        error: 'Không xoá được user',
                    });
                }
                res.status(200).send('Đã xoá user ');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
