// Third Party Modules
const { check, validationResult } = require("express-validator");
const express = require("express");

// Custom Modules
const SkillModule = require("../models/SkillModule");

const router = new express.Router();

router.post(
  "/skillmodules",
  [
    check("title", "Title is required").not().isEmpty(),
    check("level", "Level is required").not().isEmpty(),
    check("duration", "Duration is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const skill = new SkillModule(req.body);
      await skill.save();
      res.status(201).json({ skill });
    } catch (e) {
      console.error(e);
      if (e?.keyPattern?.title === 1) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Skill Already Exists" }] });
      }
      res.status(500).send("server error");
    }
  }
);

router.get("/skillmodules", async (req, res) => {
  try {
    const skills = await SkillModule.find({
      parentModule: req.query.parentModule !== "null" && req.query.parentModule !== "parent" ? req.query.parentModule : undefined,
    });
    res.status(200).json({ skills });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("server error");
  }
});

// router.get(
//   "/submodules",
//   [check("parentModule", "Parent Module is required").not().isEmpty()],
//   async (req, res) => {
//     try {
//       const skills = await SkillModule.find({
//         parentModule: req.body.parentModule,
//       });
//       res.status(200).json({ skills });
//     } catch (e) {
//       console.error(err.message);
//       res.status(500).send("server error");
//     }
//   }
// );

router.get("/skillmodules/:id", async (req, res) => {
  try {
    const skill = await SkillModule.findOne({
      _id: req.params.id,
    });
    if (!skill) {
      return res.status(404).json({ errors: [{ msg: "Skill Not Found" }] });
    }
    res.status(200).json({ skill });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("server error");
  }
});

router.patch("/skillmodules/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedupdates = [
    "title",
    "level",
    "duration",
    "resourcesLinks",
    "description",
  ];
  const operation = updates.every((update) => allowedupdates.includes(update));
  if (!operation) {
    return res.status(404).json({ errors: [{ msg: "Invalid Updates" }] });
  }
  try {
    const skill = await SkillModule.findOne({
      _id: req.params.id,
    });
    if (!skill) {
      return res.status(404).json({ errors: [{ msg: "Skill Not Found" }] });
    }
    updates.forEach((update) => (skill[update] = req.body[update]));
    await skill.save();
    res.status(200).json({ skill });
  } catch (e) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.delete("/skillmodules/:id", async (req, res) => {
  try {
    const skill = await SkillModule.findOne({
      _id: req.params.id,
    });
    if (!skill) {
      return res.status(404).json({ errors: [{ msg: "Skill Not Found" }] });
    }
    await skill.remove();
    res.status(200).json({ skill });
  } catch (e) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
