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
        return res.status(201).json({ message: "User created successfully", user: userResponse });
    } catch(e) {
        console.log(e);
        
        return res.status(500).json({ message: "Internal server error" })
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        // to check if all fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        // to find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // to check if account is currently locked
        const now = new Date();
        if (user.lockUntil && user.lockUntil > now) {
            const minuteLeft = Math.cell((user.lockUntil - now) / 1000 / 60);
            return res.status(403).json({ message: "Account locked. Try again in ${minutesLeft} minute(s)."
            });
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
            // if wrong password, add a strike
            user.loginAttempts =+ 1;

            // if 5 or more attempts, lock the account
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(now.getTime() + 15 * 60 * 1000)// 15 mins
                user.loginAttempts = 0; //reset counter after locking
            }
            await user.save();
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // if password is correct, reset attempt and lock
        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        // creating a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // send back token and user ( no password)
        const userResponse = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

       
        return res.status(200).json({ message: "User signed in successfully", token, user: userResponse });
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

// get profile- any user logged in
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
// get moderator report- moderator and admin only
const getModeratorReports = async (req, res) => {
    try {
        return res.status(200).json({ message: "Moderator reports - accessible by moderator and admin only" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// delete user profile - admin only
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Admin cannot delete themselves
        if (req.user.id.toString() === id) {
            return res.status(400).json({ message: "You cannot delete your own account"});
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
// post admin/promote/:id - admin only
const promoteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // promoting valid roles
        if (!["moderator", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // Admin cannot promote other admin
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (targetUser.role === "admin") {
            return res.status(400).json({ message: "Cannot promote another admin" });
        }
            
        targetUser.role = role;
        await targetUser.save();
         return res.status(200).json({ message: "User promoted to ${role} successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {
    registerUser,
    signIn, 
    newAdmin,
    newModerator,
    getAllUsers,
    getUserProfile,
    getModeratorReports,
    deleteUser,
    promoteUser
};
