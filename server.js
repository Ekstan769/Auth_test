const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const app = express();

const connectDb = require("./config/db");
const userRoutes = require("./routes/user.routes")



// middleware
app.use(express.json());
app.use(morgan("dev"));


const port = process.env.PORT || 5003;


app.get("/", (req, res) => {
    res.send("Hello World");
});

// routes
app.use("/api/users", userRoutes);

app.listen(port, () => {
    connectDb();
    console.log("Server is running on port ${port}");
});