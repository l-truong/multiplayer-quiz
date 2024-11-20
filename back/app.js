// Import the necessary modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

// Import route handlers
const categoryRoutes = require('./api/routes/categoryRoutes');
const questionRoutes = require('./api/routes/questionRoutes');

// Load configuration from a JSON file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const { protocol, username, password, host, database, options } = config.mongo;
const mongoUri = `${protocol}://${username}:${password}@${host}/${database}?${new URLSearchParams(options).toString()}`;

// Connect to MongoDB
mongoose.connect(mongoUri)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

// Initialize the Express application
const app = express();

// Middleware setup
app.use(morgan('dev')); // Logger for HTTP requests
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Enable CORS for all origins
app.use((req, res, next) => {
    // Set CORS headers    
    //res.header('Access-Control-Allow-Origin', 'http://quiz-app.com');
    res.header('Access-Control-Allow-Origin', '*');    
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); // Proceed to the next middleware
});

// Define route handlers
app.use('/categories', categoryRoutes);
app.use('/questions', questionRoutes);

// 404 error handling middleware
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error); // Pass the error to the next middleware
});

// General error handling middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500); // Set response status
    res.json({ error: { message: error.message } }); // Send error message as JSON
});

// Export the app instance for use in other modules
module.exports = app;