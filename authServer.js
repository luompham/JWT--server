require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/auth');
const app = express();


app.use(express.json());

//virtual database
let users = [
    {
        id: 1,
        username: 'ivan',
        refreshToken: null,
    },
    {
        id: 2,
        username: 'liam',
        refreshToken: null,

    }
]


app.get('/posts', (req, res) => {
    res.json(posts.filter(post => post.userId === req.userId));
})

const generateTokens = (payload) => {
    const { id, username } = payload;
    //create jwt
    const accessToken = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m'
    })

    const refreshToken = jwt.sign({ id, username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1h'
    })

    return { accessToken, refreshToken }
}


const updateRefreshToken = (username, refreshToken) => {
    users = users.map(user => {
        if (user.username === username) {
            return {
                ...user,
                refreshToken
            }
        }
        return user;
    })
}
app.post('/login', (req, res) => {
    //lấy username từ request client gửi lên
    const username = req.body.username
    //check username đó có trong database không
    const user = users.find(user => user.username === username)

    //in ra user xem có tìm được ko
    //  console.log(user);

    //check user có trong database không
    if (!user) { return res.sendStatus(401) }

    //gọi lại hàm generateTokens và truyền vào đối số là user
    const tokens = generateTokens(user);
    //gọi lại hàm updateRefreshToken
    updateRefreshToken(username, tokens.refreshToken);
    console.log(users)
    res.json(tokens)
})

app.post('/token', (req, res) => {
    //check body trong request có refreshToken token request ko
    const refreshToken = req.body.refreshToken
    //nếu ko có thì trả về 401
    if (!refreshToken) { return res.sendStatus(401) }

    //nếu có token thì tìm token đó có lưu trong database ko
    const user = users.find(user => user.refreshToken === refreshToken)

    //nếu ko tìm thấy thì đó là token ko hợp lệ (token giả mạo) thì trả về 403
    if (!user) { return res.sendStatus(403) }

    //nếu tìm thấy thì đưa verify token vào try catch
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        //tạo và update token
        const tokens = generateTokens(user);
        updateRefreshTokens(user.username, tokens.refreshToken);

        res.json(tokens);

    }
    catch (error) {
        console.log(error);
        res.sendStatus(403);
    }

})

app.delete('/logout', verifyToken, (req, res) => {
    // tìm user có id trong database giống với userId được trả về của function verifyToken
    const user = users.find(user => user.id === req.userId)

    //update lại refreshToken của user đó
    updateRefreshToken(user.username, null);
    console.log(users);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});