const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Create Express app
const app = express();
const port = 3000;

// Set up middleware to parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Serve static files (like HTML) from the public directory
app.use(express.static('public'));

// MongoDB URI received from the form
let mongoURI = '';

// Define the root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
  });


// Define route to handle form submission
app.post('/', async (req, res) => {
    // Get MongoDB URI from the form
    mongoURI = req.body.myuri;

    // connect to the database
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to database'))
        .catch(err => console.error('Could not connect to database', err));


    // create a schema for the quiz2 collection
    const w24StudentSchema = new mongoose.Schema({
        name: String,
        studentID: String
    });


    // create a model for the quiz2 collection
    const w24Student = mongoose.model('w24Student', w24StudentSchema);

    // Create a new document using the submitted data
    const newStudent = new w24Student({
        name: 'Saubhagya Mudiyanselage', // Replace with your real name
        studentID: '300375004', // Replace with your student ID
    });

    try {
        // Save the new document to the database
        const savedStudent = await newStudent.save();
        console.log('Saved to database:', savedStudent);
        res.send('Data saved to MongoDB.');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).send('Error saving data to MongoDB.');
    }
});


// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });