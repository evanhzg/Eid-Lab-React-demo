require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const portfinder = require('portfinder');
const studentRoutes = require('./app/routes/studentRoutes');
const companyRoutes = require('./app/routes/companyRoutes');
const professionalRoutes = require('./app/routes/professionalRoutes');
const offerRoutes = require('./app/routes/offerRoutes');
const authRoutes = require('./app/routes/authRoutes');
const auth = require('./app/middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const MONGO_URI = process.env.MONGO_URI;

const app = express();

// CORS configuration
app.use(
	cors({
		origin: /^http:\/\/localhost:\d+$/, // Allow any localhost URL with any port
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

app.use(cookieParser());
app.use(express.json());

// Use the student routes
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB and start the server
mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log('Connected to MongoDB');
		const DEFAULT_PORT = process.env.PORT || 5000;

		portfinder.basePort = DEFAULT_PORT;
		portfinder.getPort((err, port) => {
			if (err) {
				console.error('Error finding available port:', err);
				process.exit(1);
			}

			app.listen(port, 'localhost', () => {
				console.log(`Server running on http://localhost:${port}`);
			});
		});
	})
	.catch((err) => console.error('MongoDB connection error:', err));
