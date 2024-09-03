const express = require("express");
const userController = require("../controllers/users.controller");

// express router
const router = express.Router();

// Register user
router.post("/reg", userController.register);

// Login user
router.post("/login", userController.login);

// Add division to user
router.put("/adddiv", userController.assignDivision);

// Remove division from user
router.put("/subdiv", userController.deAssignDivision);

// Add orgUnit to user
router.put("/addorg", userController.assignOrgUnit);

// Remove orgUnit from user
router.put("/suborg", userController.deAssignOrgUnit);

// change user permissions
router.put("/perms", userController.changePerms);

// export
module.exports = router;
