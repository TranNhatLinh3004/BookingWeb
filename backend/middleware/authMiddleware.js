const jwt = require('jsonwebtoken');

// Middleware để xác thực JWT từ cookie
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log(process.env.JWT)

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const verifyTokenWithAdmin = (req, res, next) => {
    const token = req.cookies.token;
    console.log(process.env.JWT)

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded;
        if (req.user.isAdmin !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { verifyToken, verifyTokenWithAdmin};