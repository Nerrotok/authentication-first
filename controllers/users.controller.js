const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const OrgUnit = require("../models/orgUnit.model");
const DivisionRepo = require("../models/divisionRepo.model");

exports.register = async (req, res) => {
  try {
    // Get username and password from user
    const { name, pword } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).send({
        message: "Username is already taken",
      });
    }

    // create model
    const userModel = new User({
      name,
      pword,
    });

    // register the user to the db
    await userModel.save();

    // Feedback for the user
    res.status(200).send({
      message: `User ${name} has been registered`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error error occurred when setting this user",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { name, pword } = req.body;

    // Finc user with this name and password
    const user = await User.findOne({ name, pword })
      .populate("orgUnits")
      .populate("divisions");

    // Handle username or password being incorrect
    if (!user) {
      return res.status(404).send({
        message: "Username and/or password is incorrect",
      });
    }

    // generates user info token as payload
    const userPayload = {
      name: user.name,
      permissions: user.permissions,
      id: user._id,
    };

    const token = jwt.sign(JSON.stringify(userPayload), "seccy", {
      algorithm: "HS256",
    });

    // send token for database interaction
    // payload for front-end use
    res.status(200).send({
      token: token,
      user: userPayload,
      usableDivs: user.divisions,
      usableOrgUnits: user.orgUnits,
      message: `${user.name} has logged in.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Server error`,
    });
  }
};

//  BELOW REQUIRE ADMIN PERMISSIONS

// endpoint to assign divisions
exports.assignDivision = async (req, res) => {
  // get token
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "No token provided, please login." });
  }

  // verify token
  const userToken = jwt.verify(token, "seccy");

  if (userToken.permissions !== "admin") {
    return res
      .status(403)
      .send({ message: "You need to be an admin to do this." });
  }
  try {
    const { userName, division, orgUnit } = req.body;

    const orgUnitCheck = await OrgUnit.findOne({ name: orgUnit });
    if (!orgUnitCheck) {
      return res.status(404).send({ message: "OrgUnit not found." });
    }

    // Find the division
    const divisionDoc = await DivisionRepo.findOne({
      name: division,
      orgUnit: orgUnitCheck._id,
    });
    if (!divisionDoc) {
      return res.status(404).send({ message: "Division not found." });
    }

    // Find the user
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if user belongs to orgUnit
    if (!user.orgUnits.includes(orgUnitCheck._id)) {
      return res
        .status(400)
        .send({ message: "User doesn't belong to that OrgUnit" });
    }

    // Check if already assigned
    if (user.divisions.includes(divisionDoc._id)) {
      return res
        .status(400)
        .send({ message: "Division already assigned to the user." });
    }

    // add division to user since conditions are met
    user.divisions.push(divisionDoc._id);
    await user.save();

    // Confirmation message
    res.status(200).send({ message: "Division added to user" });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
};

// endpoint to remove divisions
exports.deAssignDivision = async (req, res) => {
  // get token
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "No token provided, please login." });
  }

  // verify token
  const userToken = jwt.verify(token, "seccy");

  if (userToken.permissions !== "admin") {
    return res
      .status(403)
      .send({ message: "You need to be an admin to do this." });
  }

  try {
    // get division details and userName
    const { userName, division, orgUnit } = req.body;

    // get unitOrg doc
    const orgUnitCheck = await OrgUnit.findOne({ name: orgUnit });
    if (!orgUnitCheck) {
      return res.status(404).send({ message: "OrgUnit not found." });
    }

    // get get division doc
    const divisionDoc = await DivisionRepo.findOne({
      name: division,
      orgUnit: orgUnitCheck._id,
    });
    if (!divisionDoc) {
      return res.status(404).send({ message: "Division not found." });
    }

    // Find the user
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // check if user has division
    if (!user.divisions.includes(divisionDoc._id)) {
      return res
        .status(404)
        .send({ message: "User does not have this division" });
    }

    // remove division
    user.divisions.pull(divisionDoc._id);

    // save the new doc
    await user.save();

    res.status(200).send({ message: "Division removed from user" });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
};

// endpoint to add orgUnits
exports.assignOrgUnit = async (req, res) => {
  // get token
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "No token provided, please login." });
  }

  // verify token
  const userToken = jwt.verify(token, "seccy");

  if (userToken.permissions !== "admin") {
    return res
      .status(403)
      .send({ message: "You need to be an admin to do this." });
  }

  try {
    // get req.body
    const { userName, orgUnit } = req.body;

    // Check if user exists
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // check if orgunit exists
    const orgUnitCheck = await OrgUnit.findOne({ name: orgUnit });
    if (!orgUnitCheck) {
      return res.status(404).send({ message: "OrgUnit not found." });
    }

    // check user is in orgUnit
    if (user.orgUnits.includes(orgUnitCheck._id)) {
      return res.status(400).send({ message: "User already in orgUnit" });
    }

    // if not, add orgUnit to user
    user.orgUnits.push(orgUnitCheck._id);

    // save
    await user.save();

    res.status(200).send({ message: "Org Unit added to the user" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// endpoint to remove orgUnits
exports.deAssignOrgUnit = async (req, res) => {
  // get token
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "No token provided, please login." });
  }

  // verify token
  const userToken = jwt.verify(token, "seccy");

  if (userToken.permissions !== "admin") {
    return res
      .status(403)
      .send({ message: "You need to be an admin to do this." });
  }

  try {
    // get stuff from body
    const { userName, orgUnit } = req.body;

    // check user exists
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // check orgUnit exists
    const orgUnitCheck = await OrgUnit.findOne({ name: orgUnit });
    if (!orgUnitCheck) {
      return res.status(404).send({ message: "OrgUnit not found." });
    }

    // check user is in orgUnit
    if (!user.orgUnits.includes(orgUnitCheck._id)) {
      return res.status(400).send({ message: "User not in orgUnit" });
    }

    // get divisions associated with orgUnit
    const divisionsInOrgUnit = await DivisionRepo.find({
      orgUnit: orgUnitCheck._id,
    });

    // remove divisions associated with orgUnit from user
    user.divisions = user.divisions.filter(
      (divisionId) =>
        !divisionsInOrgUnit.some((division) => division._id.equals(divisionId))
    );

    // remove orgUnit
    user.orgUnits.pull(orgUnitCheck._id);

    // save user doc
    await user.save();

    res.status(200).send({ message: "OrgUnit removed from user." });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

// endpoint for changing user permissions
exports.changePerms = async (req, res) => {
  // get token
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "No token provided, please login." });
  }

  // verify token
  const userToken = jwt.verify(token, "seccy");

  if (userToken.permissions !== "admin") {
    return res
      .status(403)
      .send({ message: "You need to be an admin to do this." });
  }

  try {
    // get user name and new perms
    const { userName, perms } = req.body;

    if (perms !== "normal" && perms !== "manage" && perms !== "admin") {
      res.status(400).send({ message: "invalid permissions value" });
    }

    // check user exists
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // check if perms are already it
    if (user.permissions === perms) {
      return res
        .status(400)
        .send({ message: "This user already has these permissions" });
    }

    // assign new permissions
    user.permissions = perms;

    // save user
    await user.save();

    return res.status(200).send({ message: "User permissions updated" });
  } catch (error) {
    res.status(500).send({ message: "Internal serval error." });
  }
};

exports.editUserRole;
