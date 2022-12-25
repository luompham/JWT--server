const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    //lấy header ra
    const authHeader = req.header('Authorization');
    //tách bearer ra để lấy phần token
    const token = authHeader && authHeader.split(' ')[1]
    //nếu user ko gửi token sẽ trả về 401
    if (!token) {
        res.sendStatus(401)
    }
    //nếu có token thì sẽ xác thực token và đưa vào try catch
    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decode);
        //lấy id trong phần decode và gán vào request
        req.userId = decode.id

        //sau khi xác thực xong token thì resquest có thể đi tiếp bằng next()
        next();

        //bắt lỗi khi người dùng gửi token ko hợp lệ
    } catch (error) {
        console.log(error)
        res.sendStatus(403)
    }



};

module.exports = verifyToken;
