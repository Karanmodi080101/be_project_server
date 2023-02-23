// Third party modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Self Modules
const config = require("config");

let Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: false,
    },
    talentPassport: {
      accessServices: {
        type: [String],
        required: false,
      },
      isAccess: {
        type: Boolean,
        required: false,
      },
    },
    evaluations: {
      accessTests: {
        type: [String],
        required: false,
      },
      isAccess: {
        type: Boolean,
        required: false,
      },
      isAdmin: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    myDevelopment: {
      isAdmin: {
        type: Boolean,
        required: false,
        default: false,
      },
      isAccess: {
        type: Boolean,
        required: false,
      },
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// method to delete tokens and password while sending to client
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

// seperate method to generate auth token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    config.get("jwtToken"),
    { expiresIn: 360000 }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Seperate method to find by creds
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    throw new Error("Unable to login");
  }
  return user;
};

// Seperate method to hash password
userSchema.pre("save", async function (next) {
  const user = this;
  user.userId = user._id.toString();
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10); // more you have the more secured
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});
const Users = mongoose.model("Users", userSchema);
module.exports = Users;
