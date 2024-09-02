const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbURI =
	'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority';
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.log('Failed to connect to MongoDB', err));

// Define a simple route
app.get('/', (req, res) => {
	res.send('API is working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

const userSchema = new mongoose.Schema({
	name: String,
	username: String,
	email: String,
	phone: String,
});

const User = mongoose.model('User', userSchema);

// Route to get all users
app.get('/users', async (req, res) => {
	try {
		const users = await User.find();

		const usersWithNumericIds = users.map((user) => ({
			...user._doc, // Spread existing user data
			numericId: parseInt(user._id.toString().slice(-8), 16),
		}));

		res.json(usersWithNumericIds);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Route to create a new user
app.post('/users/create', async (req, res) => {
	const user = new User(req.body);

	try {
		// Save the new user to the database
		const newUser = await user.save();
		console.log(user._id);

		// Calculate the numericId
		const userWithNumericId = {
			...newUser._doc,
			numericId: parseInt(newUser._id.toString().slice(-8), 16),
		};

		console.log('New User with numericId:', userWithNumericId);

		// Respond with the full user object, including the numericId
		res.status(201).json(userWithNumericId);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ message: err.message });
	}
});

// Route to update a user
app.put('/users/:id', async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json({ user: updatedUser });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Route to delete a user
app.delete('/users/:id', async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id);

		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		res
			.status(200)
			.json({ message: 'User deleted successfully', user: deletedUser });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});
