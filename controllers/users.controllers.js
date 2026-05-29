const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    try{
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });
        
        // syntax not to return users password
        const userResponse = {
            id: newUser. _id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        };
        return res.status(201).json({ message: "User created successfully", user: newResponse });
    } catch(e) {
        console.log(e);
        
        return res.status(500).json({ message: "Internal server error" })
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const userResponse = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: token,
        };

        const token = jwt.sign({ id: user._id, firstName: user.firstName }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })

        return res.status(200).json({ message: "User signed in successfully", user: userResponse });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// syntax to make user an admin/moderator
const newAdmin = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = "admin";
        await user.save();
        return res.status(200).json({ message: "User role updated to admin" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const newModerator = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = "moderator";
        await user.save();
        return res.status(200).json({ message: "User role updated to moderator" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to perform this action" });
    }
    try {
        const users = await User.find().select("-password");
        return res.status(200)({ users });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error"})
    }
};


module.exports = {
    registerUser,
    signIn, 
    newAdmin,
    newModerator,
    getAllUsers,
};
