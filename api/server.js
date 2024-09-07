const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const portfinder = require('portfinder');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const MONGO_URI =
	'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority';

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Use the student routes
app.use('/api', studentRoutes);

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

			app.listen(port, () => {
				console.log(`Server is running on port ${port}`);
			});
		});
	})
	.catch((err) => console.error('MongoDB connection error:', err));
