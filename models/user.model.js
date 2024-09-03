const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    // username
    name: {
      type: String,
      required: true,
    },

    // password
    pword: {
      type: String,
      required: true,
    },

    // OU names the user belongs to
    orgUnits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrgUnit",
      },
    ],
    // division names the user belongs to
    divisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DivisionRepo",
      },
    ],

    // the admin status of the user
    permissions: {
      type: String,
      required: true,
      default: "normal", // Others are "manage" and "admin"
    },
  },
  // define collection name
  { collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
