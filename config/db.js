const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to Db");
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    };
};


module.exports = connectDb;
