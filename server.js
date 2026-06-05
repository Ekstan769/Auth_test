require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();

const connectDb = require("./config/db");
const userRoutes = require("./routes/user.routes")



// middleware
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
    res.send("Hello World");
});

// routes
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on port ${PORT}`);
});