const UserService = require('../dbservice/UserService');
const CourseService = require('../dbservice/CourseService');
const cloudinary = require('cloudinary');

module.exports = class ApiUser {
    // @route   DELETE api/admin/delete/:userId
    // @desc    Delete user by admin
    // @access  Private
    static async deleteUser(req, res) {
        try {
            //get user information by id
            let { userId } = req.params;
            let userPromise = UserService.getUserInfoById(userId).then(
                async (data) => {
                    if (!data[0]) {
                        return res.status(400).json({
                            error: true,
                            msg: 'Không tìm thấy user',
                        });
                    }
                    if (data[0].imageUrl) {
                        await cloudinary.uploader.destroy(
                            data[0].imageUrl.split(' ')[1],
                        );
                    }

                    if (data[0].role === 1) {
                        CourseService.deleteIntructorCourses(data[0].id).then(
                            (deleted) => {
                                if (!deleted) {
                                    return res.status(400).json({
                                        error: true,
                                        msg: 'Chưa xoá khoá học của instructor',
                                    });
                                }
                                console.log('đã xoá khoá học của instructor');
                            },
                        );
                    }
                },
            );
            let deletePromise = UserService.deleteUserById(userId).then(
                (data) => {
                    if (!data) {
                        return res.status(400).json({
                            error: 'Không xoá được user',
                        });
                    }
                    return res.status(200).json({
                        error: false,
                        msg: 'Đã xoá user',
                    });
                },
            );

            Promise.all([userPromise, deletePromise]);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   DELETE api/admin/deleteCourse/:courseId
    // @desc    Delete course by admin
    // @access  Private
    static async deleteCourse(req, res) {
        try {
            //get user information by id
            let { courseId } = req.params;
            let coursePromise = CourseService.getCourseById(courseId).then(
                async (data) => {
                    if (!data[0]) {
                        return res.status(400).json({
                            error: true,
                            msg: 'Không tìm thấy course',
                        });
                    }
                    if (data[0].imageUrl) {
                        await cloudinary.uploader.destroy(
                            data[0].imageUrl.split(' ')[1],
                        );
                    }
                },
            );
            let deletePromise = CourseService.deleteCourseById(courseId).then(
                (data) => {
                    if (!data) {
                        return res.status(400).json({
                            error: 'Không xoá được khoá học',
                        });
                    }
                    return res.status(200).json({
                        error: false,
                        msg: 'Đã xoá khoá học',
                    });
                },
            );

            Promise.all([coursePromise, deletePromise]);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/user/listUsers
    // @desc    get users by admin
    // @access  Private
    static async listUsers(req, res) {
        try {
            UserService.listUsers().then((data) => {
                if (data.length == 0) {
                    return res
                        .status(400)
                        .json({ error: true, msg: 'Không có user nào' });
                }
                return res.status(200).json({ error: true, data });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/user/listCourses
    // @desc    get listcourses by admin
    // @access  Private
    static async listCourses(req, res) {
        try {
            CourseService.getAll().then((data) => {
                if (data.length == 0) {
                    return res
                        .status(400)
                        .json({ error: true, msg: 'Không có khoá học nào' });
                }
                return res.status(200).json({ error: true, data });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
