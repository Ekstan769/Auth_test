const express = require("express");
const { registerUser, signIn }  = require('../controllers/users.controllers');

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/signin", signIn);




module.exports = router;