require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const verifyToken = require('./middleware/auth');

app.use(express.json());

//virtual database

const posts = [
    {
        userId: 1,
        post: 'ivan post',
    },
    {
        userId: 2,
        post: 'liam post',
    },
    {
        userId: 1,
        post: 'ivan post 2',
    },
]

app.get('/posts', verifyToken, (req, res) => {
    res.json(posts.filter(post => post.userId === req.userId));
})


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});