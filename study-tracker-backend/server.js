const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

app.post("/register", (req, res) => {
    const { userId, name, email, password, image, timestamp } = req.body;
    users.push({ userId, name, email, password, image, timestamp });
    res.status(201).json({ message: "User registered successfully" });
});

app.get("/user-data", (req, res) => {
    if (users.length > 0) {
        res.json(users[users.length - 1]); // Send last registered user
    } else {
        res.status(404).json({ message: "No users found" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
