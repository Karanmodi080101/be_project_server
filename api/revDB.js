const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const auth = require('../middleware/auth');
const RevDB = require('../models/RevDB');
const Profile = require('../models/Profile');
const { check, validationResult } = require('express-validator');

// @route  GET api/revDB/me
// @desc   Get current users review data
// @access Private
router.get('/revDB/me', auth.verifyUser, async (req, res) => {
  try {
    const revDB = await RevDB.findOne({
      empId: req.user.empId
    });
    if (!revDB) {
      return res
        .status(400)
        .json({ msg: 'There is no review data present for this user' });
    }
    res.json(revDB);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/revDBMe');
  }
});

// @route  POST api/revDB
// @desc   Create/Update a review data
// @access Private
router.post(
  '/revDB',
  [check('empId', 'Employee ID is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      empId,
      reviewers,
      strengths,
      areaOfImprovement,
      strengthWithFlags
    } = req.body;
    const revDBFields = {};
    revDBFields.empId = empId;

    if (reviewers) revDBFields.reviewers = reviewers;
    if (strengths) revDBFields.strengths = strengths;
    if (areaOfImprovement) revDBFields.areaOfImprovement = areaOfImprovement;
    if (strengthWithFlags) revDBFields.strengthWithFlags = strengthWithFlags;
    try {
      let revDB = await RevDB.findOne({ empId });

      if (revDB) {
        //update in this case
        revDB = await RevDB.findOneAndUpdate(
          { empId },
          { $set: revDBFields },
          { new: true }
        );
        return res.json(revDB);
      }

      //New profile
      newRevDB = new RevDB(revDBFields);
      await newRevDB.save();
      res.json(newRevDB);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error/REVDBPOST');
    }
  }
);

// @route  GET api/revDB/all
// @desc   Get all review data
// @access Private
router.get('/all', async (req, res) => {
  try {
    const reviewsDB = await RevDB.find();
    res.json(reviewsDB);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETALLREVDB');
  }
});
// @route  GET api/revDB/user/:empId
// @desc   Get review data by empId
// @access Private
router.get('/revDB/:empId', async (req, res) => {
  try {
    const revDB = await RevDB.findOne({
      empId: req.params.empId
    });
    if (!revDB) {
      return res.status(400).json({ msg: 'There is no revDB for this user' });
    }
    res.json(revDB);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETrevDBID');
  }
});
// @route  GET api/revDB/reviewers
// @desc   Get reviewersd by empId
// @access Private
router.get('/reviewers/:empId', async (req, res) => {
  try {
    const revDB = await RevDB.findOne({
      empId: req.params.empId
    });
    if (!revDB) {
      return res.status(400).json({ msg: 'There is no revDB for this user' });
    }
    let reviewers = revDB.reviewers;
    let reviewersDetails = [];
    for (let i = 0; i < reviewers.length; i++) {
      member = {};
      if (reviewers[i] !== req.params.empId) {
        let reviewersMember = await Profile.findOne({
          empId: reviewers[i]
        });

        member['empId'] = reviewersMember.empId;
        member['fullName'] = reviewersMember.personalInformation.fullName;
        reviewersDetails.push(member);
      }
    }
    res.json(reviewersDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETrevDBID');
  }
});
module.exports = router;
