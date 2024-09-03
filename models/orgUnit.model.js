const mongoose = require("mongoose");

const orgUnitSchema = mongoose.Schema(
  {
    // Name of the organisational unit
    name: {
      type: String,
      required: true,
    },

    // array of divisions within the organisational repo
    divisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DivisionRepo", // Reference to Division schema
      },
    ],
  },
  // define collection name
  { collection: "orgunits" }
);

module.exports = mongoose.model("OrgUnit", orgUnitSchema);
