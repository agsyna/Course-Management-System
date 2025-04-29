const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const ASSIGNMENTS_FILE = "../data/assignments.json";
const CALENDAR_FILE = "../data/calendar.json";

app.use(cors());
app.use(bodyParser.json());

// Read from JSON file
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data ? JSON.parse(data) : (filePath === CALENDAR_FILE ? {} : []);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return filePath === CALENDAR_FILE ? {} : [];
    }
}

// Write to JSON file
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log("WRITE PERFORMED on", filePath);
    } catch (error) {
        console.error("Error writing to JSON file:", error);
    }
}

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
