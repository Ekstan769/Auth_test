Assignment Details
Backend Engineering Assignment
Topic: Authentication, Authorization & Secure API Design with Node.js

Stack Requirements
Use the following technologies:
Node.js
Express.js
MongoDB + Mongoose
dotenv
Morgan

Scenario
You were hired to build the backend for a startup called VaultPass — a platform where users can create private notes and manage team access securely. The company recently suffered a security breach because: users could access other users’ data, admins had too much unrestricted power, tokens never expired, and sensitive routes were exposed publicly. Your task is to redesign the backend properly.

Assignment Requirements
Project Setup
Initialize a professional backend structure.

Your project must include:
Environment variable management with dotenv
Request logging with Morgan
Proper folder structure
Error handling middleware
MongoDB connection setup

Authentication System
Implement:
User Registration
A user should register with:
fullName
email
password
role

Rules
email must be unique
password must be hashed
role can only be:
user
moderator
admin

User Login
Users should log in using:
email
password
Return:
JWT token
user information (excluding password)

Authorization Twist
Implement role-based access control.

Routes

Public Route
GET /api/public/message
Response:
{ "message": "This route is public" }
Protected Route

GET /api/user/profile
Only logged-in users can access it.
Moderator Route

GET /api/moderator/reports
Accessible only by:
moderator
admin

Admin Route
DELETE /api/admin/user/:id
Only admins can:
delete users BUT admins cannot delete themselves
(Yes, this is intentional.)

The Twist
Implement account locking.
If a user enters the wrong password:
5 consecutive times,within 10 minutes,their account should be locked for: 15 minutes.
During lock:
login must fail even if password becomes correct.
Store this properly in MongoDB.

Token Security
JWT tokens must:
expire in 1 hour
fail properly when expired
return meaningful error responses
Suspicious Activity Logger

Create middleware that logs:
failed logins
forbidden route access attempts
deleted accounts
Store logs in MongoDB.

Suggested fields:
action
user
ipAddress
timestamp

Bonus Twist (Important)
Create a route:
POST /api/admin/promote/:id
Rules:
only admins can promote users
admins CANNOT promote another admin
moderators cannot promote anyone
users cannot access the route

Deliverables
Students must submit:
GitHub Repository
With:
clean commits
meaningful README
Postman Collection
Include:
all endpoints
example requests
example responses

Database Design
Explain:
collections used
why each field exists
Extra Challenge Questions
Students must answer these theoretically:

Question 1
Why is storing plain passwords dangerous even in small applications?

Question 2
What is the difference between:
authentication
authorization
Give real-world examples.

Question 3
Why is JWT expiration important?
What could happen if tokens never expire?

Question 4
A hacker gets access to a valid JWT token.
What are 3 things you can implement to reduce damage?

Question 5
Why should logging systems be treated as sensitive infrastructure?
