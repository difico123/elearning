const bcrypt = require('bcryptjs'); // encrypt password
const UserService = require('../dbservice/UserService');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require('fs');

module.exports = class ApiUser {
    // @route   POST api/user/register
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

                UserService.addUser(user).then((created) => {
                    if (!created) {
                        return res
                            .status(400)
                            .send('Chưa đăng kí được tài khoản');
                    }
                    res.status(200).send('Đăng kí tài khoản thành công');
                });
            });
        } catch (error) {
            res.status(500).send('server error ' + error.message);
        }
    }

    // @route   POST api/user/login
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

    // @route   GET api/user/info
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
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.uploadDir = './uploads/users';
        form.maxFieldsSize = 1000000;
        form.maxFileSize = 1000000;
        form.multiples = false;

        let { id } = req.user;

        UserService.getUserInfoById(id)
            .then((users) => {
                let { imageUrl } = users[0];

                form.parse(req, (err, fields, files) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'File của bạn bị lỗi, có thể do kích thước file lớn hơn 1MB',
                        });
                    }
                    let newUser = fields;
                    newUser.id = id;

                    if (files['imageUrl']) {
                        const { size, type, path } = files['imageUrl'];
                        if (size !== 0) {
                            if (
                                type != 'image/jpeg' &&
                                type != 'image/jpg' &&
                                type != 'image/png'
                            ) {
                                fs.unlinkSync(path);
                                return res.status(400).json({
                                    error: 'Image type is not allowed!',
                                });
                            }

                            if (fs.existsSync(imageUrl)) {
                                fs.unlinkSync(imageUrl);
                                console.log(`successfully deleted ${imageUrl}`);
                            }
                            newUser.imageUrl = path;
                        }
                    }
                    UserService.updateUserInfo(newUser).then((updated) => {
                        if (!updated) {
                            return res.status(400).json({
                                error: 'Không sửa được thông tin của bạn ',
                            });
                        }
                        res.status(200).send('Đã sửa thông tin của bạn ');
                    });
                });
            })
            .catch((err) => {
                console.log(err.message);
                res.status(500).send('Server error');
            });
    }

    // @route   DELETE api/users/delete
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
                            error: 'Bạn chưa trở thành instructor',
                        });
                    }
                    res.status(200).send('Bạn đã trở thành instructor');
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/user/showAvt
    // @desc    show user avatar
    // @access  Public
    static async showAvt(req, res) {
        try {
            //get user information by id
            let { id } = req.params;
            UserService.showAvt(id).then((data) => {
                let { imageUrl } = data[0];
                if (!imageUrl) {
                    return res.status(400).json({
                        error: 'Không có dữ liệu đường dẫn ảnh',
                    });
                }
                fs.readFile(imageUrl, function (err, imgData) {
                    if (err) {
                        return res.send(err);
                    }
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.end(imgData);
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
            UserService.getUserInfoById(id).then(async(data) => {
                const isMatch = await bcrypt.compare(
                    password,
                    data[0].password,
                );
                if (!isMatch) {
                    return res.status(404).json({
                        error: 'Mật khẩu của bạn không chính xác',
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
                        ? res
                              .status(200)
                              .json('Mật khẩu của bạn đã được cập nhật')
                        : res
                              .status(400)
                              .json({ error: 'Mật khẩu chưa được cập nhật' });
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
