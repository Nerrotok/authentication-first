const mongoose = require("mongoose");

const divisionRepoSchema = mongoose.Schema(
  {
    // the name of the division within the organisational unit
    name: {
      type: String,
      required: true,
    },

    // References which orgUnit this model belongs to,
    // added for clarity it allows the user to see which OrgUnit the division belongs to
    orgUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrgUnit",
      required: true,
    },

    // the credentials that belong to the the division
    placeCreds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlaceCred",
      },
    ],
  },
  // define collection name
  { collection: "divisionrepos" }
);

module.exports = mongoose.model("DivisionRepo", divisionRepoSchema);
