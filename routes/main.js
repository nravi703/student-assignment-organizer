const express = require("express");
const router = express.Router();
const db = require("../db.js");

// Define our app data
var appData = {
    appName: "Student Assignment Organizer",
    searchResults: [],
};

// Home route
router.get("/", function (req, res) {
    res.render("index.ejs", appData);
});

// About route
router.get("/about", function (req, res) {
    res.render("about.ejs", appData);
});

// Search page route
router.get("/search", function (req, res) {
    let newData = Object.assign({}, appData, { searchResults: [] });
    res.render("search.ejs", newData);
});

// Search results route
router.get("/search-result", function (req, res) {
    const keyword = req.query.keyword;
    const sqlQuery = "SELECT * FROM assignments WHERE name LIKE ?";
    const searchParam = `%${keyword}%`;

    db.query(sqlQuery, [searchParam], (err, result) => {
        if (err) {
            console.error(err.message);
            res.send("Error occurred while searching for assignments.");
        } else {
            let newData = Object.assign({}, appData, { searchResults: result });
            res.render("search-results.ejs", newData);
        }
    });
});

// Progress page route
router.get("/progress", function (req, res) {
    const inProgressQuery =
        "SELECT name AS title, due_date AS dueDate FROM assignments WHERE status = 'Incomplete'";
    const completedQuery =
        "SELECT name AS title FROM assignments WHERE status = 'Completed'";

    const inProgressPromise = new Promise((resolve, reject) => {
        db.query(inProgressQuery, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    const completedPromise = new Promise((resolve, reject) => {
        db.query(completedQuery, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    Promise.all([inProgressPromise, completedPromise])
        .then(([inProgress, completed]) => {
            const completedAssignments = completed.map((assignment) => ({
                ...assignment,
                dueDate: new Date(assignment.dueDate).toLocaleDateString(), // Format the due date if necessary
            }));
            const inProgressAssignments = inProgress.map((assignment) => ({
                ...assignment,
                dueDate: new Date(assignment.dueDate).toLocaleDateString(), // Format the due date if necessary
            }));

            const newData = Object.assign({}, appData, {
                inProgress: inProgressAssignments,
                completed: completedAssignments,
            });
            res.render("progress.ejs", newData);
        })
        .catch((err) => {
            console.error("Error fetching progress data:", err.message);
            res.send("Error occurred while fetching progress data.");
        });
});

// Calendar page route
router.get("/calendar", function (req, res) {
    const sqlQuery =
        "SELECT name AS title, due_date AS dueDate FROM assignments ORDER BY due_date ASC";

    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error("Error occurred while fetching calendar data:", err.message);
            res.send("Error occurred while fetching calendar data.");
        } else {
            const newData = Object.assign({}, appData, { calendar: result });
            res.render("calendar.ejs", newData);
        }
    });
});

// Add assignment page
router.get("/add-assignment", function (req, res) {
    res.render("add-assignment.ejs", appData);
});

router.post("/assignment-added", function (req, res) {
    const sqlQuery = `
        INSERT INTO assignments (name, description, due_date, status, student_id) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const { name, description, due_date, status, student_id } = req.body;

    db.query(sqlQuery, [name, description, due_date, status, student_id], (err) => {
        if (err) {
            console.error("Error occurred while adding the assignment:", err.message);
            res.send("Error occurred while adding the assignment.");
        } else {
            res.send("Assignment added successfully!");
        }
    });
});

// Render the registration page
router.get("/register", (req, res) => {
    // Render the register page without any error or success messages
    res.render("register", { error: null, success: null });
});

// Registration submission route
router.post("/register", (req, res) => {
    const { username, email, password, role } = req.body;

    // Check if the user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkUserQuery, [username, email], (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.render('register', { error: 'Server error. Please try again.', success: null });
        }

        if (results.length > 0) {
            return res.render('register', { error: 'Username or email already exists.', success: null });
        }

        // Insert user into the database
        const insertQuery = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [username, email, password, role], (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.render('register', { error: 'Server error. Please try again.', success: null });
            }

            res.render('register', { error: null, success: 'Registration successful! You can now log in.' });
        });
    });
});

// Render the sign-in page
router.get("/sign-in", (req, res) => {
    res.render("sign-in", { error: null, success: null });
});

// Sign-in submission route
router.post("/sign-in", (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.render('sign-in', { error: 'Server error. Please try again.', success: null });
        }

        if (results.length === 0) {
            return res.render('sign-in', { error: 'Email or password is incorrect.', success: null });
        }

        const user = results[0];
        if (user.password_hash !== password) {
            return res.render('sign-in', { error: 'Email or password is incorrect.', success: null });
        }
        
        // Successful login: Redirect to the welcome page with the username
        res.redirect(`welcome?username=${encodeURIComponent(user.username)}`);
    });
});

// Render the welcome page
router.get("/welcome", (req, res) => {
    const username = req.query.username; // Get username from query parameter
    if (!username) {
        return res.redirect('/sign-in'); // Redirect if username is not available
    }
    res.render('welcome', { username });
});

// Logout route
router.get("/logout", (req, res) => {
    res.redirect("sign-in"); // Redirect to the sign-in page
});

module.exports = router;