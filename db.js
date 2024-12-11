// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'actualUsername',       // Replace with actual username
    password: 'actualPassword',   // Replace with actual password
    database: 'StudentAssignmentOrganizer'
});

// Ensure the database is connected before starting the server
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
        console.log('DB object:', db); // Debugging the db object
    }
});

module.exports = db;
