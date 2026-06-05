const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        //to check if the user's role is allowed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to access this route"});
        }
        next();
    };
};

module.exports = authorizeRoles;