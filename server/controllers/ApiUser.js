const bcrypt = require('bcryptjs'); // encrypt password
const UserService = require('../dbservice/UserService');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloud/cloudinary');
const crypto = require('crypto');
const sendEmail = require('../utils/sendmail');

module.exports = class ApiUser {
    // @route   POST api/auth/register
    // @desc    Register user
    // @access  Public
    static async register(req, res) {
        try {
            let { email } = req.body;

            let hasUser = UserService.getUserByEmail(email);

            hasUser.then(async (data) => {
                if (data[0]) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Email này đã có người đăng kí',
                    });
                }

                const salt = await bcrypt.genSalt(10);
                let user = req.body;
                let { password } = user;
                user.password = await bcrypt.hash(password, salt);

                if (req.file !== undefined) {
                    const result = await cloudinary.uploader.upload(
                        req.file.path,
                        {
                            folder: 'avatars',
                            width: 150,
                            crop: 'scale',
                        },
                    );
                    user.imageUrl = `${result.secure_url} ${result.public_id}`;
                }

                UserService.addUser(user).then((created) => {
                    if (!created) {
                        return res.status(400).json({
                            error: true,
                            msg: 'Chưa đăng kí được tài khoản',
                        });
                    }
                    res.status(201).json({
                        error: false,
                        msg: 'Đăng kí tài khoản thành công',
                        user,
                    });
                });
            });
        } catch (error) {
            res.status(500).send('server error ' + error.message);
        }
    }

    // @route   POST api/auth/login
    // @desc    login user
    // @access  Public
    static async login(req, res) {
        let { email, password } = req.body;
        //find user
        UserService.getUserByEmail(email)
            .then(async (data) => {
                if (!data[0]) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Email này chưa được đăng kí',
                    });
                }

                try {
                    // Compare passwords
                    const isMatch = await bcrypt.compare(
                        password,
                        data[0].password,
                    );
                    if (!isMatch) {
                        return res.status(400).json({
                            error: true,
                            msg: 'Mật khẩu của bạn không chính xác',
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

                            const options = {
                                expires: new Date(
                                    Date.now() +
                                        process.env.COOKIE_EXPIRE *
                                            24 *
                                            60 *
                                            60 *
                                            1000,
                                ),
                                httpOnly: true,
                            };

                            return res
                                .status(200)
                                .cookie('token', token, options)
                                .json({
                                    error: false,
                                    token,
                                    user: data[0],
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
    // @route   POST api/auth/logout
    // @desc    logout user
    // @access  Public
    static logout(req, res) {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({
            error: false,
            msg: 'Logged Out',
        });
    }
    // @route   POST api/auth/forgotPassword
    // @desc    forgot user Password
    // @access  Public
    static forgotPassword(req, res) {
        let { email } = req.body;

        UserService.getUserByEmail(email).then((data) => {
            if (data.length === 0) {
                return res.status(400).json({
                    error: true,
                    msg: 'Email của bạn không đúng',
                });
            }
            let user = {
                id: data[0].id,
            };

            // Generating Password Reset Token
            const resetToken = crypto.randomBytes(20).toString('hex');

            // Hashing and adding resetPasswordToken to user
            user.resetPasswordToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');

            let dat = new Date();
            dat.setMinutes(dat.getMinutes() + 5);
            user.resetPasswordExpire = dat;

            UserService.updateUserInfo(user).then(async (updated) => {
                if (!updated) {
                    return res.status(400).json({
                        error: true,
                        msg: 'chưa cập nhật được token',
                    });
                }
                // return res.status(200).json({error: false, user})

                const resetPasswordUrl = `${req.protocol}://${req.get(
                    'host',
                )}/api/auth/resetPassword/${resetToken}`;

                const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

                try {
                    await sendEmail({
                        email: email,
                        subject: `Elearning Password Recovery`,
                        message,
                    });

                    return res.status(200).json({
                        error: false,
                        message: `Email sent to ${email} successfully`,
                    });
                } catch (error) {
                    user.resetPasswordToken = null;
                    user.resetPasswordExpire = null;

                    UserService.updateUserInfo(user).then(async (updated) => {
                        if (!updated) {
                            return res.status(400).json({
                                error: true,
                                msg: 'chưa cập nhật được token là null',
                            });
                        }
                        return res.status(200).json({
                            error: false,
                            msg: 'chưa gửi được email nhưng dù sao cũng ok',
                        });
                    });
                }
            });
        });
    }

    // @route   POST api/auth/resetPassword/:token
    // @desc    reset user Password
    // @access  Public
    static resetPassword(req, res) {
        let { newPassword, confirmPassword } = req.body;
        let { token } = req.params;

        // creating token hash
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        UserService.getUserByResetPasswordToken(resetPasswordToken).then(
            async (data) => {
                if (!data[0]) {
                    return res.status(400).json({
                        error: true,
                        msg: 'token của bạn không đúng',
                    });
                }
                let dat = new Date();
                if (data[0].resetPasswordExpire < dat) {
                    return res.status(400).json({
                        error: true,
                        msg: 'token đã hết hạn',
                    });
                }
                let user = {
                    id: data[0].id,
                };
                if (newPassword !== confirmPassword) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Mật khẩu mới và mật khẩu xác nhận của bạn không khớp',
                    });
                }

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
                user.resetPasswordExpire = null;
                user.resetPasswordToken = null;

                UserService.updateUserInfo(user).then((updated) => {
                    if (!updated) {
                        return res.status(400).json({
                            error: true,
                            msg: 'mật khẩu mới chưa được cập nhật',
                        });
                    }

                    return res.status(200).json({
                        error: false,
                        msg: 'mật khẩu của bạn đã được đổi thành công',
                    });
                });
            },
        );
    }

    // @route   GET api/user/info
    // @desc    Get user information
    // @access  Private
    static async getInfor(req, res) {
        try {
            //get user information by id
            let { id } = req.user;
            UserService.getUserInfoById(id).then((data) => {
                res.json({
                    error: false,
                    user: data[0],
                });
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
        let { firstName, middleName, lastName, phoneNumber, address, city } =
            req.body;

        let newUser = {
            id: req.user.id,
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            phoneNumber: phoneNumber,
            address: address,
            city: city,
        };

        try {
            if (req.file !== undefined) {
                await UserService.getUserInfoById(req.user.id).then(
                    async (data) => {
                        if (data[0].imageUrl) {
                            await cloudinary.uploader.destroy(
                                data[0].imageUrl.split(' ')[1],
                            );
                        }

                        const result = await cloudinary.uploader.upload(
                            req.file.path,
                            {
                                folder: 'avatars',
                                width: 150,
                                crop: 'scale',
                            },
                        );
                        newUser.imageUrl = `${result.secure_url} ${result.public_id}`;
                    },
                );
            }

            UserService.updateUserInfo(newUser).then((updated) => {
                if (!updated) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Không sửa được thông tin của bạn ',
                    });
                }
                res.status(200).json({
                    error: false,
                    msg: 'Đã sửa thông tin của bạn',
                });
            });
        } catch (error) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }

    // @route   PUT api/user/beAnInstructor
    // @desc    to be an beIntructor
    // @access  Private
    static async beAnInstructor(req, res) {
        try {
            //get user information by id
            UserService.getUserInfoById(req.user.id).then((data) => {
                data[0].role = 1;

                UserService.updateUserInfo(data[0]).then((updated) => {
                    if (!updated) {
                        return res.status(400).json({
                            error: true,
                            msg: 'Bạn chưa trở thành instructor',
                        });
                    }
                    res.status(200).json({
                        error: false,
                        msg: 'Bạn đã trở thành instructor',
                    });
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/user/showAvt/:userId
    // @desc    show user avatar
    // @access  Public
    static async showAvt(req, res) {
        try {
            //get user information by id
            let { userId } = req.params;
            UserService.showAvt(userId).then((data) => {
                if (data.length === 0) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Không tìm thấy thông tin của user',
                    });
                }
                let { imageUrl } = data[0];
                if (!imageUrl) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Không có dữ liệu đường dẫn ảnh',
                    });
                }

                return res.status(200).json({
                    error: false,
                    imageUrl: imageUrl.split(' ')[0],
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
    static async checkCorrectPassword(req, res, next) {
        let { id } = req.user;

        let { password } = req.body;

        UserService.getUserInfoById(id).then(async (data) => {
            const isMatch = await bcrypt.compare(password, data[0].password);
            if (!isMatch) {
                return res.status(404).json({
                    error: true,
                    msg: 'Mật khẩu của bạn không chính xác',
                });
            } else {
                next();
            }
        });
    }

    // @route   PUT api/user/editPw
    // @desc    edit user password
    // @access  private
    static async editPw(req, res) {
        try {
            //get user information by id
            let { id } = req.user;

            let { confirmPassword, newPassword } = req.body;

            // UserService.getUserInfoById(id).then(async (data) => {
            //     const isMatch = await bcrypt.compare(
            //         password,
            //         data[0].password,
            //     );
            //     if (!isMatch) {
            //         return res.status(404).json({
            //             error: true,
            //             msg: 'Mật khẩu của bạn không chính xác',
            //         });
            //     }
            if (confirmPassword !== newPassword) {
                return res.status(404).json({
                    error: true,
                    msg: 'Mật khẩu xác nhận không khớp',
                });
            }
            const salt = await bcrypt.genSalt(10);
            let user = {
                id: id,
                password: newPassword,
            };
            user.password = await bcrypt.hash(user.password, salt);
            UserService.updateUserInfo(user).then((updated) => {
                return updated
                    ? res.status(200).json({
                          error: false,
                          msg: 'Mật khẩu của bạn đã được cập nhật',
                      })
                    : res.status(400).json({
                          error: true,
                          msg: 'Mật khẩu chưa được cập nhật',
                      });
            });
            // });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
