const bcrypt = require('bcryptjs'); // encrypt password
const UserService = require('../dbservice/UserService');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const cloudinary = require('../config/cloud/cloudinary');
const fs = require('fs');

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
                    return res
                        .status(400)
                        .json({ error: 'Email này đã có người đăng kí' });
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
                    res.status(200).json({
                        error: false,
                        msg: 'Đăng kí tài khoản thành công',
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
                    return res
                        .status(400)
                        .json({ error: 'Email này chưa được đăng kí' });
                }

                try {
                    // Compare passwords
                    const isMatch = await bcrypt.compare(
                        password,
                        data[0].password,
                    );
                    if (!isMatch) {
                        return res.status(404).json({
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
                    data,
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
                await UserService.getUserInfoById(req.user.id).then(async(data) => {
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
                });
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

    // @route   PUT api/user/editPw
    // @desc    edit user password
    // @access  private
    static async editPw(req, res) {
        try {
            //get user information by id
            let { id } = req.user;

            let password = req.body.password;
            UserService.getUserInfoById(id).then(async (data) => {
                const isMatch = await bcrypt.compare(
                    password,
                    data[0].password,
                );
                if (!isMatch) {
                    return res.status(404).json({
                        error: true,
                        msg: 'Mật khẩu của bạn không chính xác',
                    });
                }
                const salt = await bcrypt.genSalt(10);
                let user = {
                    id: id,
                    password: req.body.newPassword,
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
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
