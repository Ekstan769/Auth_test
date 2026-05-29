const express = require("express");
const { registerUser, signIn, newAdmin, newModerator, getAllUsers }  = require('../controllers/users.controllers');
const isAuthentication = require("../utils/isAuthentication");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/signin", signIn);
router.patch("/new-admin/:userId", newAdmin);
router.patch("/new-moderator/:userId", newModerator);
router.get("/all-users", isAuthentication, getAllUsers);


module.exports = router;