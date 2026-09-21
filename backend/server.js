const express = require("express");

const app = express();

const PORT = 5050;


// Middleware
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Smart Student Assistant Backend is running!"
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});