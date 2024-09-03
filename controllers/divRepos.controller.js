const User = require("../models/user.model");
const DivRepo = require("../models/divisionRepo.model");
const OrgUnit = require("../models/orgUnit.model");
const jwt = require("jsonwebtoken");
const PlaceCred = require("../models/placeCred.model");
const mongoose = require("mongoose");

// gets place credentials
exports.getPlaceCreds = async (req, res) => {
  try {
    // get auth token
    const auth = req.headers["authorization"];
    const token = auth.split(" ")[1];

    const userToken = jwt.verify(token, "seccy");

    // Check id is there and get relevant user information from db
    const user = await User.findById(userToken.id).populate(
      "orgUnits divisions"
    );

    // Check user exists, just in case
    if (!user) {
      return res.status(404).send({ error: "User not found in database." });
    }

    // get requested orgUnit an division from front-end
    const { orgUnit, division } = req.body;

    // Check if user has permissions to division
    const { divisionRepoData } = await accessToDivisionCheck(
      orgUnit,
      division,
      user
    );

    // return placeCredentials to front-end
    return res.status(200).send(divisionRepoData.placeCreds);
  } catch (error) {
    if (error.message.includes("Token not valid")) {
      res.status(401).send({ error: "Token not valid, please login." });
    } else if (
      error.message.includes("Organisational Unit not found") ||
      error.message.includes("Access denied")
    ) {
      res.status(403).send({ error: error.message });
    } else if (error.message.includes("Place credential not found")) {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({ error: "An internal server error occurred." });
    }
  }
};

// endpoint for adding credentials to repo
exports.addCredential = async (req, res) => {
  try {
    // get auth token
    const auth = req.headers["authorization"];
    const token = auth.split(" ")[1];

    // verify token
    const userToken = jwt.verify(token, "seccy");

    // check user id exists
    const user = await User.findById(userToken.id).populate(
      "orgUnits divisions"
    );

    // Check user exists, just in case
    if (!user) {
      return res.status(404).send({ error: "User not found in database." });
    }

    // get info for cred they want to add
    const { orgUnit, division, name, login, password } = req.body;

    // Check if user has permissions to division
    const { divisionRepoData } = await accessToDivisionCheck(
      orgUnit,
      division,
      user
    );

    // add new place credentials to the database
    // Create new placeCred to add
    const placeCredModel = new PlaceCred({
      name: name,
      login: login,
      pword: password,
    });

    const newPlaceCred = await placeCredModel.save();

    // push newPlaceCred tp divisionRepoData and save it
    divisionRepoData.placeCreds.push(newPlaceCred._id);
    await divisionRepoData.save();

    // confirmation message
    res.status(200).send({ message: "New credentials saved successfully." });
  } catch (error) {
    if (error.message.includes("Token not valid")) {
      res.status(401).send({ error: "Token not valid, please login." });
    } else if (
      error.message.includes("Organisational Unit not found") ||
      error.message.includes("Access denied")
    ) {
      res.status(403).send({ error: error.message });
    } else if (error.message.includes("Place credential not found")) {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({ error: "An internal server error occurred." });
    }
  }
};

// endpoint for updating credentials
exports.updatePlaceCred = async (req, res) => {
  try {
    // get auth token
    const auth = req.headers["authorization"];
    const token = auth.split(" ")[1];

    const userToken = jwt.verify(token, "seccy");

    // Check id is there and get relevant user information from db
    const user = await User.findById(userToken.id).populate(
      "orgUnits divisions"
    );

    // Check user exists, just in case
    if (!user) {
      return res.status(404).send({ error: "User not found in database." });
    }

    if (user.permissions !== "manage" && user.permissions !== "admin") {
      return res.status(403).send({
        error: "This user does not have permission to update credentials.",
      });
    }

    const { credName, areaToUpdate, update, orgUnit, division } = req.body;

    // Check user permission to division repo
    await accessToDivisionCheck(orgUnit, division, user);

    // Find the credential to update
    const placeCred = await PlaceCred.findOne({ name: credName });
    if (!placeCred) {
      return res.status(404).send({ error: "Place credential not found." });
    }

    // update place Credential
    placeCred[areaToUpdate] = update;
    await placeCred.save();

    res.status(200).send({ message: "Place credential updated." });
  } catch (error) {
    if (error.message.includes("Token not valid")) {
      res.status(401).send({ error: "Token not valid, please login." });
    } else if (
      error.message.includes("Organisational Unit not found") ||
      error.message.includes("Access denied")
    ) {
      res.status(403).send({ error: error.message });
    } else if (error.message.includes("Place credential not found")) {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({ error: "An internal server error occurred." });
    }
  }
};

async function accessToDivisionCheck(orgUnit, division, user) {
  try {
    const orgUnitData = await OrgUnit.findOne({ name: orgUnit });

    if (!orgUnitData) {
      throw new Error("Organisational Unit not found in database.");
    }

    let orgUnitAccess = false;

    // Turn ids to strings
    orgUnitIdString = orgUnitData._id.toString();

    for (let i = 0; i < user.orgUnits.length; i++) {
      // turn object ids to strings
      let userOrgUnitIdString = user.orgUnits[i]._id.toString();

      if (userOrgUnitIdString === orgUnitIdString) {
        orgUnitAccess = true;
        break;
      }
    }

    // Check user has access to orgUnit
    if (!orgUnitAccess) {
      throw new Error("Access denied to organisational unit");
    }

    // Use orgUnit and division to find division repo and get place credentials
    const divisionRepoData = await DivRepo.findOne({
      name: division,
      orgUnit: orgUnitData._id,
    }).populate("placeCreds");

    // check user can access division

    let divisionAccess = false;

    // Turn ids to strings
    let divisionIdString = divisionRepoData._id.toString();

    for (let i = 0; i < user.divisions.length; i++) {
      // turn object ids to strings
      let userDivisionIdString = user.divisions[i]._id.toString();

      if (userDivisionIdString === divisionIdString) {
        divisionAccess = true;
        break;
      }
    }

    if (!divisionAccess) {
      throw new Error("Access to division denied.");
    }

    return { orgUnitData, divisionRepoData };
  } catch (error) {
    throw new Error(error.message);
  }
}
