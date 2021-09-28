const pool = require('./db');

module.exports.init = async function () {
    await pool.query(
        'CREATE TABLE IF NOT EXISTS users ( ' +
            ' id int(11) NOT NULL,' +
            'name varchar(200) NOT NULL,' +
            'email varchar(200) NOT NULL,' +
            ' created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP' +
            ')ENGINE=InnoDB DEFAULT CHARSET=latin1;',
    );
    await pool.query('ALTER TABLE users ADD PRIMARY KEY (id);');
    await pool.query(
        ' ALTER TABLE users MODIFY id int(11) NOT NULL AUTO_INCREMENT;',
    );

    console.log('create tables successfully');
};
