const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	console.error('JWT_SECRET is not set in the environment variables');
	process.exit(1);
}

exports.register = async (req, res) => {
	try {
		const { email, password, confirmPassword, role } = req.body;

		if (!password || !confirmPassword) {
			return res.status(400).json({
				message: 'Both password and confirm password are required',
				password: password ? 'Provided' : 'Missing',
				confirmPassword: confirmPassword ? 'Provided' : 'Missing',
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: 'Passwords do not match' });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const user = new User({ email, password, role });
		await user.save();

		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: '1d',
		});

		res.status(201).json({ token, userId: user._id, role: user.role });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error registering user', error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});

		res.json({
			message: 'Logged in successfully',
			role: user.role,
			token: token,
			userId: user._id,
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ message: 'Error logging in', error: error.message });
	}
};

exports.logout = (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
	});
	res.status(200).json({ message: 'Logged out successfully' });
};

exports.checkAuth = async (req, res) => {
	// If the request reaches here, it means the token is valid
	res.json({ isAuthenticated: true });
};
