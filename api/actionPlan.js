const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ActionPlanDB = require('../models/ActionPlanDB');
// @route  POST api/actionplan
// @desc   Create/Update an actionplan
// @access Private
router.post(
  '/actionPlan',
  [
    check('modules', 'Modules are required').not().isEmpty(),
    check('empId', 'Employee ID is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { empId, modules } = req.body;
    const actionPlanFields = {};
    actionPlanFields.empId = empId;
    actionPlanFields.modules = modules; // temporary for now!
    // actionPlanFields.modules = [];
    // modules.forEach((module) => {
    //   let skillModuleFields = {};
    //   let skillVar = module.skill.toLowerCase();
    //   skillModuleFields.skill = skillVar;
    //   if (module.child) skillModuleFields.child = module.child;
    //   if (module.beginnerModule)
    //     skillModuleFields.beginnerModule = module.beginnerModule;
    //   if (module.beginnerTime)
    //     skillModuleFields.beginnerTime = module.beginnerTime;
    //   if (module.moderateModule)
    //     skillModuleFields.moderateModule = module.moderateModule;
    //   if (module.moderateTime)
    //     skillModuleFields.moderateTime = module.moderateTime;
    //   if (module.advancedModule)
    //     skillModuleFields.advancedModule = module.advancedModule;
    //   if (module.advancedTime)
    //     skillModuleFields.advancedTime = module.advancedTime;
    //   actionPlanFields.modules.push(skillModuleFields);
    // });

    try {
      let actionPlan = await ActionPlanDB.findOne({ empId });

      if (actionPlan) {
        //update in this case
        actionPlan = await ActionPlanDB.findOneAndUpdate(
          { empId },
          { $set: actionPlanFields },
          { new: true }
        );
        return res.json(actionPlan);
      }

      //New module
      newModule = new ActionPlanDB(actionPlanFields);
      await newModule.save();
      res.json(newModule);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error/POSTActionPlan');
    }
  }
);
// @route  GET api/actionPlan/:empId
// @desc   Get actionPlan by empId
// @access Private
router.get('/actionPlan/:empId', async (req, res) => {
  try {
    const actionPlan = await ActionPlanDB.findOne({
      empId: req.params.empId
    });

    if (!actionPlan) {
      return res.status(400).json({ msg: 'There is no Module for this user' });
    }
    res.json(actionPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETActionPlan');
  }
});
module.exports = router;
