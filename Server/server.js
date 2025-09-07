// server.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: "config.env" });

const app = express();
app.use(cors());
app.use(express.json());

let client;
let db;

// ================= CONNECT DB =================
async function connectDB() {
    if (!client || !client.topology?.isConnected()) {
        client = new MongoClient(process.env.ATLAS_URI);
        await client.connect();
        db = client.db("metodo");
        console.log("✅ Connected to MongoDB");

        try {
            await db.collection("users").createIndex({ email: 1 }, { unique: true });
            console.log("✅ Email index ensured (unique)");
        } catch (err) {
            console.error("⚠️ Index creation error:", err.message);
        }
    }
    return db;
}

// ================= MIDDLEWARE =================
function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains id
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
}

// ===================== REGISTER =====================
app.post("/api/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await connectDB();

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists ❌" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({ email, password: hashedPassword });

        res.json({ msg: "Registered successfully ✅" });
    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// ===================== LOGIN =====================
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await connectDB();
        const user = await db.collection("users").findOne({ email });

        if (!user) return res.status(400).json({ msg: "User not found ❌" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials ❌" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// ===================== TASKS =====================

// Get tasks
app.get("/api/tasks", authMiddleware, async (req, res) => {
    try {
        const db = await connectDB();
        const tasks = await db.collection("tasks")
            .find({ userId: new ObjectId(req.user.id) })
            .toArray();
        res.json(tasks);
    } catch (err) {
        console.error("Get Tasks Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// Add a task
app.post("/api/tasks", authMiddleware, async (req, res) => {
    try {
        const { title } = req.body;
        const db = await connectDB();
        const newTask = {
            userId: new ObjectId(req.user.id),
            title,
            createdAt: new Date(),
            done: false,
            completedAt: null
        };
        await db.collection("tasks").insertOne(newTask);
        res.json({ msg: "Task added ✅" });
    } catch (err) {
        console.error("Add Task Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// Toggle task done/undone
app.put("/api/tasks/:id/done", authMiddleware, async (req, res) => {
    try {
        const db = await connectDB();
        const task = await db.collection("tasks").findOne({ 
            _id: new ObjectId(req.params.id),
            userId: new ObjectId(req.user.id)
        });

        if (!task) return res.status(404).json({ msg: "Task not found ❌" });

        const newDone = !task.done;

        const updated = await db.collection("tasks").findOneAndUpdate(
            { _id: new ObjectId(req.params.id), userId: new ObjectId(req.user.id) },
            { 
                $set: { 
                    done: newDone, 
                    completedAt: newDone ? new Date() : null 
                }
            },
            { returnDocument: "after" }
        );

        res.json(updated.value);
    } catch (err) {
        console.error("Toggle Done Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// Delete task
app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const db = await connectDB();
        await db.collection("tasks").deleteOne({ 
            _id: new ObjectId(req.params.id), 
            userId: new ObjectId(req.user.id) 
        });
        res.json({ msg: "Task deleted ✅" });
    } catch (err) {
        console.error("Delete Task Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// ===================== NOTES =====================

// Get all notes
app.get("/api/notes", authMiddleware, async (req, res) => {
    try {
        const db = await connectDB();
        const notes = await db.collection("notes")
            .find({ userId: new ObjectId(req.user.id) })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(notes);
    } catch (err) {
        console.error("Get Notes Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// Add a note
app.post("/api/notes", authMiddleware, async (req, res) => {
  const { title } = req.body;
  const newNote = {
    userId: new ObjectId(req.user.id),
    title: title || "Untitled Note",
    content: "",
    createdAt: new Date(),
  };
  await db.collection("notes").insertOne(newNote);
  res.json(newNote);
});


// Get single note by ID
app.get("/api/notes/:id", authMiddleware, async (req, res) => {
    try {
        const db = await connectDB();
        const note = await db.collection("notes").findOne({ 
            _id: new ObjectId(req.params.id),
            userId: new ObjectId(req.user.id)
        });
        if (!note) return res.status(404).json({ msg: "Note not found ❌" });
        res.json(note);
    } catch (err) {
        console.error("Get Note Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// Update note (title & content)
app.put("/api/notes/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const db = await connectDB();
        const updated = await db.collection("notes").findOneAndUpdate(
            { _id: new ObjectId(req.params.id), userId: new ObjectId(req.user.id) },
            { $set: { title, content } },
            { returnDocument: "after" }
        );
        res.json(updated.value);
    } catch (err) {
        console.error("Update Note Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// delete note
app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection("notes").deleteOne({
            _id: new ObjectId(req.params.id),
            userId: new ObjectId(req.user.id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "Note not found ❌" });
        }

        res.json({ msg: "Note deleted ✅" });
    } catch (err) {
        console.error("Delete Note Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});



// ================= START SERVER =================
app.listen(process.env.PORT || 5000, () => console.log("🚀 Server running on port 5000"));
