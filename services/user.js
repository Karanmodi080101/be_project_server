const { validationResult } = require("express-validator");
const Users = require("../models/Users");

// user signup
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    name,
    email,
    password,
    talentPassportAccess,
    evaluationAccess,
    myDevelopmentAccess,
  } = req.body;

  try {
    //check if user exists
    let user = await Users.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    user = new Users({
      name,
      email,
      userId: "dummy_userid_will_be_replaced_automatically_on_save",
      password,
      isActive: true,
      talentPassport: {
        isAccess: talentPassportAccess,
      },
      evaluations: {
        isAccess: evaluationAccess,
      },
      myDevelopment: {
        isAccess: myDevelopmentAccess,
      },
    });

    await user.save();

    const token = await user.generateAuthToken();
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

const getUser = (req, res) => {
  res.json({ user: req.user });
};

const deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedupdates = ["name", "userId", "password", "email"];
  const operation = updates.every((update) => allowedupdates.includes(update));
  if (!operation) {
    return res.status(400).send({
      error: "Invalid updates!",
    });
  }
  if (updates.includes("password")) {
    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Password should be of minimum length 6" }] });
    }
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.json({ user: req.user });
  } catch (e) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

// user login
const login = async (req, res) => {
  // validate the user
  const errors = validationResult(req);

  // throw validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  try {
    // find user
    const user = await Users.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).json({ msg: "Logged out" });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { signup, getUser, deleteUser, updateUser, login, logout };
