const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const DevGoals = require('../models/DevGoals');

// @route  POST api/devGoals
// @desc   post development goals
// @access Private
router.post(
  '/devGoals',
  [check('empId', 'empId is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { empId, goals } = req.body;
    const devGoalFields = {};
    devGoalFields.empId = empId;

    if (goals) devGoalFields.goals = goals;

    try {
      let devGoals = await DevGoals.findOne({ empId });
      if (devGoals) {
        //update in this case
        devGoals = await DevGoals.findOneAndUpdate(
          { empId },
          { $set: devGoalFields },
          { new: true }
        );
        return res.json(devGoals);
      }

      //New module
      newModule = new DevGoals(devGoalFields);
      await newModule.save();
      res.json(newModule);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error/POSTSKILLMODULE');
    }
  }
);

// @route  GET api/devGoals/:empId
// @desc   Get devGoals by empId
// @access Private
router.get('/devGoals/:empId', async (req, res) => {
  try {
    const devGoals = await DevGoals.findOne({
      empId: req.params.empId
    });
    //console.log('devgoals ?',devGoals);
    if (!devGoals) {
      return res.status(400).json({ msg: 'There is no Module for this user' });
    }
    res.json(devGoals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETActionPlan');
  }
});
module.exports = router;
