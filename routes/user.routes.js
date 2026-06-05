const express = require("express");
const { registerUser, signIn, newAdmin, newModerator, getAllUsers, getUserProfile, getModeratorReports, deleteUser, promoteUser }  = require('../controllers/users.controllers');
const isAuthentication = require("../utils/isAuthentication");
const authorizeRoles = require("../utils/authorizeRoles");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/signin", signIn);

// User profile ( any user logged in)
router.get("/profile", isAuthentication, getUserProfile);

// Moderator route (moderator and admin only)
router.get("/moderator/reports", isAuthentication, authorizeRoles("moderator", "admin"), getModeratorReports);

// admin route (admin only)
router.delete("/admin/user/:id", isAuthentication, authorizeRoles("admin"), deleteUser);
router.post("/admin/promote/:id", isAuthentication, authorizeRoles("admin"), promoteUser);

router.patch("/new-admin/:userId", newAdmin);
router.patch("/new-moderator/:userId", newModerator);
router.get("/all-users", isAuthentication, getAllUsers);


module.exports = router;