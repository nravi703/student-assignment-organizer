// Import the required modules
var express = require('express');
var ejs = require('ejs');
const db = require('./db.js'); 

// Create the express application object
const app = express();
const port = 3000;
 
// Set up the view engine
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({ extended: true }));

// Static Files (e.g., for CSS, images)
app.use(express.static(__dirname + '/public'));

// Routes
const mainRoutes = require("./routes/main"); // Import your routes
app.use('/', mainRoutes);

// Ensure the database is connected before starting the server
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
