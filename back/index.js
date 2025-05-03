const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const PORT = 3000;

const ASSIGNMENTS_FILE = "../data/assignments.json";
const CALENDAR_FILE = "../data/calendar.json";
const USERS_FILE = "../data/users.json";
const SCHEDULES_DIR = path.join(__dirname, '../data/schedules');
const FACULTY_DIR = path.join(__dirname, '../data/faculty');

app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Helper function to read JSON files
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data ? JSON.parse(data) : (filePath === CALENDAR_FILE ? {} : []);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return filePath === CALENDAR_FILE ? {} : [];
    }
}

// Helper function to write JSON files
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log("WRITE PERFORMED on", filePath);
    } catch (error) {
        console.error("Error writing to JSON file:", error);
    }
}

// Login endpoint
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const users = readJsonFile(USERS_FILE).users;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
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
    const filePath = path.join(__dirname, '../data/courses.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).json({ error: 'Courses data not found' });
            return;
        }
        res.json(JSON.parse(data));
    });
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
