let pool = require('./db');

module.exports.initialize = async function () {
    await pool.query(
        'CREATE TABLE IF NOT EXISTS users ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'firstName VARCHAR(50) NOT NULL, ' +
            'middleName VARCHAR(50), ' +
            'lastName VARCHAR(50) NOT NULL, ' +
            'email VARCHAR(50) NOT NULL UNIQUE, ' +
            'phoneNumber VARCHAR(10) NOT NULL, ' +
            'address VARCHAR(50), ' +
            'city VARCHAR(50), ' +
            'role INT NOT NULL DEFAULT 0, ' +
            'password VARCHAR(255) NOT NULL, ' +
            'imageUrl VARCHAR(255), ' +
            'resetPasswordToken VARCHAR(255), ' +
            'resetPasswordExpire datetime, ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS categories ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'name VARCHAR(255) NOT NULL, ' +
            'imageUrl VARCHAR(500), ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS courses ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'name VARCHAR(255) NOT NULL, ' +
            'des VARCHAR(255) NOT NULL, ' +
            'instructor INT NOT NULL, ' +
            'category INT NOT NULL, ' +
            'verified INT NOT NULL DEFAULT 0, ' +
            'imageUrl VARCHAR(500), ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'FOREIGN KEY(instructor) REFERENCES users(id) ON DELETE CASCADE, ' +
            'FOREIGN KEY(category) REFERENCES categories(id) ON DELETE CASCADE ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS topics ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'indexOrder INT NOT NULL, ' +
            'title VARCHAR(255) NOT NULL, ' +
            'content TEXT NOT NULL, ' +
            'course INT NOT NULL, ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'UNIQUE(indexOrder, course), ' +
            'FOREIGN KEY(course) REFERENCES courses(id) ON DELETE CASCADE ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS user_courses ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'user INT NOT NULL, ' +
            'course INT NOT NULL, ' +
            'rating enum("1","2","3","4","5"), ' +
            'isComplete INT NOT NULL DEFAULT 0, ' +
            'marks INT, ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'UNIQUE(user, course), ' +
            'FOREIGN KEY(user) REFERENCES users(id) ON DELETE CASCADE, ' +
            'FOREIGN KEY(course) REFERENCES courses(id) ON DELETE CASCADE ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS notifications ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'user INT NOT NULL, ' +
            'topic VARCHAR(300) NOT NULL, ' +
            'details TEXT NULL, ' +
            'viewed INT NOT NULL DEFAULT 0, ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'FOREIGN KEY(user) REFERENCES users(id) ON DELETE CASCADE ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS chats ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'user INT NOT NULL, ' +
            'course INT NOT NULL, ' +
            'message TEXT NOT NULL, ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'FOREIGN KEY(user) REFERENCES users(id) ON DELETE CASCADE, ' +
            'FOREIGN KEY(course) REFERENCES courses(id) ON DELETE CASCADE ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS quizes ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'title VARCHAR(500) NOT NULL, ' +
            'topic INT NOT NULL, ' +
            'shown INT NOT NULL DEFAULT 0, ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'FOREIGN KEY(topic) REFERENCES topics(id) ON DELETE CASCADE ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS questions ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'quiz INT NOT NULL, ' +
            'content VARCHAR(1000), ' +
            'marks INT NOT NULL DEFAULT 5,' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'FOREIGN KEY(quiz) REFERENCES quizes(id) ON DELETE CASCADE ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS choices ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'content VARCHAR(1000), ' +
            'question INT NOT NULL, ' +
            'isAnswer INT NOT NULL DEFAULT 0, ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'FOREIGN KEY(question) REFERENCES questions(id) ON DELETE CASCADE ' +
            '); ',
    );

    await pool.query(
        'CREATE TABLE IF NOT EXISTS user_questions ( ' +
            'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            'user INT NOT NULL, ' +
            'question INT NOT NULL, ' +
            'choice INT NOT NULL, ' +
            'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'UNIQUE(user, question), ' +
            'FOREIGN KEY(user) REFERENCES users(id) ON DELETE CASCADE, ' +
            'FOREIGN KEY(question) REFERENCES questions(id) ON DELETE CASCADE, ' +
            'FOREIGN KEY(choice) REFERENCES choices(id) ON DELETE CASCADE ' +
            ');',
    );

    // await pool.query('INSERT INTO categories (name) ' +
    //     'VALUES ("Công nghệ"), ("Kinh doanh"), ("Sáng tạo"), ("Kỹ năng cá nhân"), ("Ngoại ngữ"); ')

    console.log('created databases');
};
