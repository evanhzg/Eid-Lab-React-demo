const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
	console.log('Full request headers:', req.headers);
	console.log('Cookies:', req.cookies);
	console.log('Token from cookie:', req.cookies?.token);
	console.log('Token from Authorization header:', req.header('Authorization'));

	const token =
		req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ message: 'No token, authorization denied' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};

module.exports = authMiddleware;
