const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config({
    path: './config/environment/index.env',
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const connect = require('./config/db/db_initialize');

app.use('/api/users', require('./routes/user'));

app.use((req, res) => {
    res.status(404).json({
        msg: 'Page not found',
    });
});
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
