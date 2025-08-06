import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET

const auth = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
        console.log(decoded);
        req.userId = decoded.id;
        req.userName = decoded.name;
        req.userEmail = decoded.email;

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }

    next();


}

export default auth;
