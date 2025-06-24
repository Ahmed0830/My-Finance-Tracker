import jwt from 'jsonwebtoken' ;


const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) {
        return res.status(401).json({error: 'No token provided'});
    }
    try {
        // eslint-disable-next-line no-undef
        const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err){
        console.error('Authentication error:', err);
        return res.status(401).json({error: 'Invalid token'});
    }
}

export default authMiddleware;