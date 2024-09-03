const mongoose = require("mongoose");

const placeCredSchema = mongoose.Schema(
  {
    // Name of application/place to access
    name: {
      type: String,
      required: true,
    },

    // The userName for the application/place
    login: {
      type: String,
      required: true,
    },

    // password for the application/place
    pword: {
      type: String,
      requirec: true,
    },
  },
  // define collection name
  { collection: "placecreds" }
);

module.exports = mongoose.model("PlaceCred", placeCredSchema);
