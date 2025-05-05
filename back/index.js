const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const PORT = 3000;

// Define absolute paths for data files
const DATA_DIR = path.join(__dirname, '../data');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'assignments.json');
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const PROFESSORS_FILE = path.join(DATA_DIR, 'professors.json');
const COURSES_FILE = path.join(DATA_DIR, 'allcourses.json');
const SCHEDULES_DIR = path.join(DATA_DIR, 'schedules');
const FACULTY_DIR = path.join(DATA_DIR, 'faculty');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Helper function to read JSON files
function readJsonFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return filePath === CALENDAR_FILE ? {} : [];
        }
        const data = fs.readFileSync(filePath, "utf8");
        if (!data) {
            console.error(`Empty file: ${filePath}`);
            return filePath === CALENDAR_FILE ? {} : [];
        }
        const parsed = JSON.parse(data);
        return parsed;
    } catch (error) {
        console.error(`Error reading JSON file ${filePath}:`, error);
        return filePath === CALENDAR_FILE ? {} : [];
    }
}

// Helper function to write JSON files
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing JSON file ${filePath}:`, error);
        return false;
    }
}

// Login endpoint
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    try {
        const data = readJsonFile(USERS_FILE);
        if (!data || !data.users) {
            console.error('Invalid users data structure');
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }
        const user = data.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
});

// Routes for attendance data
app.get('/api/attendance/:section', (req, res) => {
    const section = req.params.section;
    const filePath = path.join(__dirname, '../data/attendance', `${section}.json`);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).json({ error: 'Attendance data not found' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Routes for marks data
app.get('/api/marks/:section', (req, res) => {
    const section = req.params.section;
    const filePath = path.join(__dirname, '../data/marks', `${section}.json`);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).json({ error: 'Marks data not found' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Route for courses data
app.get('/api/courses', (req, res) => {
    const courses = readJsonFile(COURSES_FILE);
    if (!Array.isArray(courses)) {
        return res.status(500).json({ error: 'Invalid courses data format' });
    }
    res.json(courses);
});

// Get single course by ID
app.get('/api/courses/:id', (req, res) => {
    const courses = readJsonFile(COURSES_FILE);
    if (!Array.isArray(courses)) {
        return res.status(500).json({ error: 'Invalid courses data format' });
    }
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
});

// Get all assignments
app.get("/assignments", (req, res) => {
    const assignments = readJsonFile(ASSIGNMENTS_FILE);
    res.json(assignments);
});

// Get calendar data
app.get("/calendar", (req, res) => {
    const calendar = readJsonFile(CALENDAR_FILE);
    res.json(calendar);
});

// Add new assignment
app.post("/assignments", (req, res) => {
    const { title, dueDate, points, submissions, instructions } = req.body;

    if (!title || !dueDate) {
        return res.status(400).json({ error: "Title and due date are required." });
    }

    const assignments = readJsonFile(ASSIGNMENTS_FILE);
    const calendar = readJsonFile(CALENDAR_FILE);

    const existingAssignments = calendar[dueDate] || [];
    if (existingAssignments.length >= 2) {
        return res.status(400).json({ error: "This date already has 2 assignments. Choose another date." });
    }

    assignments.push({ title, dueDate, points, submissions, instructions });
    writeJsonFile(ASSIGNMENTS_FILE, assignments);

    if (!calendar[dueDate]) calendar[dueDate] = [];
    calendar[dueDate].push(title);
    writeJsonFile(CALENDAR_FILE, calendar);

    res.json({ message: "Assignment added successfully!" });
});

// Delete assignment
app.delete("/assignments/:title/:date", (req, res) => {
    const { title, date } = req.params;

    let assignments = readJsonFile(ASSIGNMENTS_FILE);
    let calendar = readJsonFile(CALENDAR_FILE);

    assignments = assignments.filter(a => !(a.title === title && a.dueDate === date));
    writeJsonFile(ASSIGNMENTS_FILE, assignments);

    if (calendar[date]) {
        calendar[date] = calendar[date].filter(t => t !== title);
        if (calendar[date].length === 0) delete calendar[date];
        writeJsonFile(CALENDAR_FILE, calendar);
    }

    res.json({ message: "Assignment deleted successfully!" });
});

// Update assignment
app.put("/assignments/:oldTitle/:oldDate", (req, res) => {
    const { oldTitle, oldDate } = req.params;
    const updatedAssignment = req.body;

    let assignments = readJsonFile(ASSIGNMENTS_FILE);
    let calendar = readJsonFile(CALENDAR_FILE);

    // Remove old title from old date in calendar
    if (calendar[oldDate]) {
        calendar[oldDate] = calendar[oldDate].filter(t => t !== oldTitle);
        if (calendar[oldDate].length === 0) delete calendar[oldDate];
    }

    if (updatedAssignment.dueDate !== oldDate) {
        const newDateAssignments = calendar[updatedAssignment.dueDate] || [];
        if (newDateAssignments.length >= 2) {
            return res.status(400).json({ error: "New date already has 2 assignments" });
        }
    }

    let assignmentFound = false;
    assignments = assignments.map(a => {
        if (a.title === oldTitle && a.dueDate === oldDate) {
            assignmentFound = true;
            return updatedAssignment;
        }
        return a;
    });

    if (!assignmentFound) {
        return res.status(404).json({ error: "Assignment not found" });
    }

    if (!calendar[updatedAssignment.dueDate]) calendar[updatedAssignment.dueDate] = [];
    calendar[updatedAssignment.dueDate].push(updatedAssignment.title);

    writeJsonFile(ASSIGNMENTS_FILE, assignments);
    writeJsonFile(CALENDAR_FILE, calendar);

    res.json({ message: "Assignment updated successfully!" });
});

// Schedule endpoint
app.get('/api/schedule/:section', (req, res) => {
    const section = req.params.section;
    const scheduleFile = path.join(SCHEDULES_DIR, `${section}_schedule.json`);
    
    fs.readFile(scheduleFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading schedule file:', err);
            return res.status(500).json({ error: 'Failed to read schedule data' });
        }
        
        try {
            const scheduleData = JSON.parse(data);
            res.json(scheduleData);
        } catch (error) {
            console.error('Error parsing schedule data:', error);
            res.status(500).json({ error: 'Failed to parse schedule data' });
        }
    });
});

// POST new schedule for a section
app.post('/api/faculty/schedule', (req, res) => {
    const { section, schedule } = req.body;

    if (!section || !schedule) {
        return res.status(400).json({ message: "Section and schedule data are required." });
    }

    const scheduleFile = path.join(FACULTY_DIR, `${section}_schedule.json`);

    try {
        // Write the schedule to the respective file
        writeJsonFile(scheduleFile, schedule);
        res.json({ message: "Schedule created successfully!" });
    } catch (error) {
        console.error("Error writing schedule:", error);
        res.status(500).json({ message: "Failed to create schedule." });
    }
});

// Students CRUD Operations
app.get("/api/students", (req, res) => {
    const students = readJsonFile(STUDENTS_FILE);
    res.json(students);
});

// Get single student by ID
app.get("/api/students/:id", (req, res) => {
    const students = readJsonFile(STUDENTS_FILE);
    const student = students.find(s => s.id === req.params.id);
    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json(student);
});

app.post("/api/students", (req, res) => {
    const students = readJsonFile(STUDENTS_FILE);
    const newStudent = {
        id: `BMU${1000 + students.length + 1}`,
        ...req.body,
        status: "Active"
    };
    students.push(newStudent);
    if (writeJsonFile(STUDENTS_FILE, students)) {
        res.json({ success: true, student: newStudent });
    } else {
        res.status(500).json({ success: false, message: "Failed to add student" });
    }
});

app.put("/api/students/:id", (req, res) => {
    const students = readJsonFile(STUDENTS_FILE);
    const index = students.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: "Student not found" });
    }
    students[index] = { ...students[index], ...req.body };
    if (writeJsonFile(STUDENTS_FILE, students)) {
        res.json({ success: true, student: students[index] });
    } else {
        res.status(500).json({ success: false, message: "Failed to update student" });
    }
});

app.delete("/api/students/:id", (req, res) => {
    const students = readJsonFile(STUDENTS_FILE);
    const filteredStudents = students.filter(s => s.id !== req.params.id);
    if (writeJsonFile(STUDENTS_FILE, filteredStudents)) {
        res.json({ success: true, message: "Student deleted successfully" });
    } else {
        res.status(500).json({ success: false, message: "Failed to delete student" });
    }
});

// Professors CRUD Operations
app.get("/api/professors", (req, res) => {
    const professors = readJsonFile(PROFESSORS_FILE);
    res.json(professors);
});

// Get single professor by ID
app.get("/api/professors/:id", (req, res) => {
    const professors = readJsonFile(PROFESSORS_FILE);
    const professor = professors.find(p => p.id === req.params.id);
    if (!professor) {
        return res.status(404).json({ success: false, message: "Professor not found" });
    }
    res.json(professor);
});

app.post("/api/professors", (req, res) => {
    const professors = readJsonFile(PROFESSORS_FILE);
    const newProfessor = {
        id: `BMUF${String(professors.length + 1).padStart(3, '0')}`,
        ...req.body,
        courses: []
    };
    professors.push(newProfessor);
    if (writeJsonFile(PROFESSORS_FILE, professors)) {
        res.json({ success: true, professor: newProfessor });
    } else {
        res.status(500).json({ success: false, message: "Failed to add professor" });
    }
});

app.put("/api/professors/:id", (req, res) => {
    const professors = readJsonFile(PROFESSORS_FILE);
    const index = professors.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: "Professor not found" });
    }
    professors[index] = { ...professors[index], ...req.body };
    if (writeJsonFile(PROFESSORS_FILE, professors)) {
        res.json({ success: true, professor: professors[index] });
    } else {
        res.status(500).json({ success: false, message: "Failed to update professor" });
    }
});

app.delete("/api/professors/:id", (req, res) => {
    const professors = readJsonFile(PROFESSORS_FILE);
    const filteredProfessors = professors.filter(p => p.id !== req.params.id);
    if (writeJsonFile(PROFESSORS_FILE, filteredProfessors)) {
        res.json({ success: true, message: "Professor deleted successfully" });
    } else {
        res.status(500).json({ success: false, message: "Failed to delete professor" });
    }
});

// Courses CRUD Operations
app.post("/api/courses", (req, res) => {
    const courses = readJsonFile(COURSES_FILE);
    const newCourse = {
        id: `CS${String(courses.length + 1).padStart(3, '0')}`,
        ...req.body,
        currentEnrollment: 0,
        status: "Active"
    };
    courses.push(newCourse);
    if (writeJsonFile(COURSES_FILE, courses)) {
        res.json({ success: true, course: newCourse });
    } else {
        res.status(500).json({ success: false, message: "Failed to add course" });
    }
});

app.put("/api/courses/:id", (req, res) => {
    const courses = readJsonFile(COURSES_FILE);
    const index = courses.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: "Course not found" });
    }
    courses[index] = { ...courses[index], ...req.body };
    if (writeJsonFile(COURSES_FILE, courses)) {
        res.json({ success: true, course: courses[index] });
    } else {
        res.status(500).json({ success: false, message: "Failed to update course" });
    }
});

app.delete("/api/courses/:id", (req, res) => {
    const courses = readJsonFile(COURSES_FILE);
    const filteredCourses = courses.filter(c => c.id !== req.params.id);
    if (writeJsonFile(COURSES_FILE, filteredCourses)) {
        res.json({ success: true, message: "Course deleted successfully" });
    } else {
        res.status(500).json({ success: false, message: "Failed to delete course" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
