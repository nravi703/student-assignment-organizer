CREATE DATABASE StudentAssignmentOrganizer;
USE StudentAssignmentOrganizer;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords
    role ENUM('Student', 'Teacher', 'Admin') DEFAULT 'Student', -- User roles for permissions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (username, email, password_hash, role) VALUES
('student1', 'student1@example.com', 'hashedpassword1', 'Student'),
('student2', 'student2@example.com', 'hashedpassword2', 'Student'),
('student3', 'student3@example.com', 'hashedpassword3', 'Student'),
('student4', 'student4@example.com', 'hashedpassword4', 'Student'),
('student5', 'student5@example.com', 'hashedpassword5', 'Student'),
('student6', 'student6@example.com', 'hashedpassword6', 'Student'),
('student7', 'student7@example.com', 'hashedpassword7', 'Student'),
('student8', 'student8@example.com', 'hashedpassword8', 'Student'),
('student9', 'student9@example.com', 'hashedpassword9', 'Student'),
('student10', 'student10@example.com', 'hashedpassword10', 'Student'),
('teacher1', 'teacher1@example.com', 'hashedpassword11', 'Teacher'),
('teacher2', 'teacher2@example.com', 'hashedpassword12', 'Teacher'),
('admin1', 'admin1@example.com', 'hashedpassword13', 'Admin'),
('admin2', 'admin2@example.com', 'hashedpassword14', 'Admin');

SELECT * FROM users;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO students (user_id, name, email) VALUES
(1, 'John Doe', 'student1@example.com'),
(2, 'Jane Smith', 'student2@example.com'),
(3, 'Michael Johnson', 'student3@example.com'),
(4, 'Emily Davis', 'student4@example.com'),
(5, 'William Brown', 'student5@example.com'),
(6, 'Olivia White', 'student6@example.com'),
(7, 'James Wilson', 'student7@example.com'),
(8, 'Sophia Moore', 'student8@example.com'),
(9, 'Benjamin Lee', 'student9@example.com'),
(10, 'Isabella Clark', 'student10@example.com');

SELECT * FROM students;

CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status ENUM('Incomplete', 'Completed') DEFAULT 'Incomplete',
    student_id INT, -- Optional, if assignments are linked to students
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO assignments (name, description, due_date, status, student_id) VALUES
('Math Homework 1', 'Complete exercises 1-10 from Chapter 4', '2024-12-01', 'Incomplete', 1),
('Science Report', 'Write a 2-page report on renewable energy', '2024-12-05', 'Incomplete', 1),
('History Essay', 'Analyze the causes of World War II', '2024-12-07', 'Completed', 2),
('Art Project', 'Create a sculpture using recycled materials', '2024-12-10', 'Incomplete', 3),
('Physics Lab', 'Submit lab report for experiment 3', '2024-12-03', 'Incomplete', 4),
('English Poem', 'Write a 10-line poem about nature', '2024-12-15', 'Completed', 5),
('Computer Science Assignment', 'Develop a basic calculator app', '2024-12-12', 'Incomplete', 6),
('Biology Study', 'Prepare for the upcoming biology test', '2024-12-08', 'Incomplete', 7),
('Geography Presentation', 'Create a presentation on climate change', '2024-12-06', 'Completed', 8),
('Literature Review', 'Summarize the key themes in "To Kill a Mockingbird"', '2024-12-04', 'Incomplete', 9),
('Chemistry Experiment', 'Conduct an experiment and submit a report', '2024-12-09', 'Completed', 10),
('Math Homework 2', 'Solve advanced algebra problems', '2024-12-02', 'Incomplete', 1),
('Essay on Economics', 'Write an essay on economic policies', '2024-12-11', 'Incomplete', 2),
('Art Sketch', 'Sketch a cityscape with pencil', '2024-12-14', 'Completed', 3),
('Programming Challenge', 'Solve algorithmic problems in Python', '2024-12-13', 'Incomplete', 4),
('French Language Assignment', 'Complete chapter 7 exercises', '2024-12-16', 'Incomplete', 5),
('Debate Preparation', 'Prepare arguments for the debate on climate change', '2024-12-17', 'Incomplete', 6),
('Short Story', 'Write a short story about friendship', '2024-12-18', 'Completed', 7),
('Physics Theory', 'Review key concepts for the final exam', '2024-12-19', 'Incomplete', 8),
('Sociology Paper', 'Draft a 3-page paper on social issues', '2024-12-20', 'Incomplete', 9),
('Journal Entry', 'Write a journal entry reflecting on the semester', '2024-12-21', 'Completed', 10);

SELECT * FROM assignments;

CREATE USER 'actualUsername'@'localhost' IDENTIFIED BY 'actualPassword';

GRANT ALL PRIVILEGES ON StudentAssignmentOrganizer.* TO 'actualUsername'@'localhost';
FLUSH PRIVILEGES;

SELECT user, host FROM mysql.user;



