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

// Function to read 
function readJsonFile(filePath) {
    try 
    {
        const data = fs.readFileSync(filePath, "utf8");

        return data ? JSON.parse(data) : (filePath === CALENDAR_FILE ? {} : []); 
    } 
    catch (error) 
    {
        return filePath === CALENDAR_FILE ? {} : []; 
    }
}


// to write to json
function writeJsonFile(filePath, data) {
    try{
    
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
   
        console.log("WRITE PERFORMED on", filePath);
    } 
    catch (error)
     {
        console.error("Error writing to JSON file:", error);
    }
}

// fetch all assignments
app.get("/assignments", (req, res) => 
    {
    const assignments = readJsonFile(ASSIGNMENTS_FILE);

    res.json(assignments);
});

// fetch all deadlines
app.get("/calendar", (req, res) => 
    {
    const calendar = readJsonFile(CALENDAR_FILE);
    
    res.json(calendar);
});


app.post("/assignments", (req, res) => 
    {
    const { title, dueDate, points, submissions, instructions } = req.body;

    if (!title || !dueDate) 
        {
        return res.status(400).json({ error: "Title and due date are required." });
    }

    let assignments = readJsonFile(ASSIGNMENTS_FILE);

    let calendar = readJsonFile(CALENDAR_FILE);
    const existingAssignments = calendar[dueDate] || [];

    if (existingAssignments.length >= 2) 
        {
        return res.status(400).json({ error: "This date already has 2 assignments. Choose another date." });
    }

    assignments.push({ title, dueDate, points, submissions, instructions });
    writeJsonFile(ASSIGNMENTS_FILE, assignments);

    if (!calendar[dueDate])
         {
        calendar[dueDate] = [];
    }
    
    calendar[dueDate].push(title);
    writeJsonFile(CALENDAR_FILE, calendar);

    console.log("Updated calendar:", calendar);


    res.json({ message: "Assignment added successfully!" });
});



app.listen(PORT, () => 
    {
    console.log(`Server running on http://localhost:${PORT}`);
});
