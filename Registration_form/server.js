const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const env= require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Define schema and model for user
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: Number,
    password: String
});

const User = mongoose.model('User', userSchema);

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// // Route for registration form
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// Route for registration form submission
app.post('/register', async (req, res) => {
    const { first_name, last_name, email,phone,password } = req.body;

    try {
        // Create new user
        const newUser = new User({
            first_name,
            last_name,
            email,
            phone,
            password
        });
        await newUser.save();
        res.sendFile(path.join(__dirname, './public/registration-successful/index.html'));
    } catch (err) {
        console.log(err);
        res.sendFile(path.join(__dirname, './public/registration-unsuccesful/index.html'));
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
