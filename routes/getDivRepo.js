const express = require("express");
const divReposController = require("../controllers/divRepos.controller");

const router = express.Router();

// Viewing creds from a repo
router.post("/creds", divReposController.getPlaceCreds);

// Adding cred to repo
router.post("/add", divReposController.addCredential);

// Updating credential
router.put("/update", divReposController.updatePlaceCred);

module.exports = router;
