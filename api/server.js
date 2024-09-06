const express = require('express');
const mongoose = require('mongoose');
const app = express();
const studentRoutes = require('./routes/studentRoutes');
const cors = require('cors');
app.use(cors());

const MONGO_URI =
	'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority';

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log('Connected to MongoDB');
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json()); // Middleware for parsing JSON bodies
app.use('/api', studentRoutes); // Use the student routes
