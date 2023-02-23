const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Profile = require('../models/Profile');
const User = require('../models/Users');
const { check, validationResult } = require('express-validator');

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/profile/me', auth.verifyUser, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      empId: req.user.userId //no empId it is userId
    });
    //console.log("profilehai",profile);
    const managerEmpId = profile?.employmentInformation.manager;
    //console.log("managerEmpId",managerEmpId);
    const user = await User.findOne({ empId: managerEmpId });
    profile.employmentInformation.managerName = user?.name ? user?.name : 'NA';
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/profileMe');
  }
});

// @route  POST api/profile
// @desc   Create/Update a profile
// @access Private
router.post(
  '/post',
  [
    check('empId', 'Employee ID is required').not().isEmpty(),
    check('fullName', 'First Name is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      empId,
      teamId,
      fullName,
      dob,
      birthCountry,
      birthPlace,
      gender,
      nationality,
      contactNumber,
      aboutMe,
      dateOfEmployment,
      currentRole,
      department,
      isManager,
      manager,
      managerName,
      workEx,
      team,
      teamTechStack,
      currentProject,
      pastProjects,
      hardSkills,
      softSkills,
      personalityMindAttr
    } = req.body;
    const profileFields = {};
    profileFields.empId = empId;
    profileFields.teamId = teamId;

    profileFields.personalInformation = {};
    if (fullName) profileFields.personalInformation.fullName = fullName;
    if (dob) profileFields.personalInformation.dob = dob;
    if (birthCountry) profileFields.personalInformation.birthCountry = birthCountry;
    if (birthPlace) profileFields.personalInformation.birthPlace = birthPlace;
    if (gender) profileFields.personalInformation.gender = gender;
    if (nationality)
      profileFields.personalInformation.nationality = nationality;
    if (contactNumber)
      profileFields.personalInformation.contactNumber = contactNumber;
    if (aboutMe) profileFields.personalInformation.aboutMe = aboutMe;

    profileFields.employmentInformation = {};

    if (dateOfEmployment)
      profileFields.employmentInformation.dateOfEmployment = dateOfEmployment;
    if (currentRole)
      profileFields.employmentInformation.currentRole = currentRole;
    if (department) profileFields.employmentInformation.department = department;
    if (manager) profileFields.employmentInformation.manager = manager;
    if (managerName) profileFields.employmentInformation.managerName = managerName;
    if (isManager) profileFields.employmentInformation.isManager = isManager;

    if (team) profileFields.employmentInformation.team = team;
    if (teamTechStack)
      profileFields.employmentInformation.teamTechStack = teamTechStack;
    if (currentProject)
      profileFields.employmentInformation.currentProject = currentProject;
    if (pastProjects)
      profileFields.employmentInformation.pastProjects = pastProjects;
    if (hardSkills) profileFields.employmentInformation.hardSkills = hardSkills;
    if (softSkills) profileFields.employmentInformation.softSkills = softSkills;
    if (workEx) profileFields.employmentInformation.workEx = workEx;
    if (personalityMindAttr)
      profileFields.employmentInformation.personalityMindAttr =
        personalityMindAttr;
    try {
      let profile = await Profile.findOne({ empId });
      if (profile) {
        //update in this case
        console.log('profile hai kya',profile);
        profile = await Profile.findOneAndUpdate(
          { empId },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //New profile
      newProfile = new Profile(profileFields);
      //console.log('Profile Fields', newProfile);
      await newProfile.save();
      res.json(newProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error/POSTPROFILE');
    }
  }
);

// @route  GET api/profile/all
// @desc   Get all profiles
// @access Private
router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETALLPROFILES');
  }
});
// @route  GET api/profile/user/:empId
// @desc   Get profile by empId
// @access Private
router.get('/user/:empId', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      empId: req.params.empId
    });
    console.log('Profile',profile);
    const managerEmpId = profile?.employmentInformation.manager;
    const user = await User.findOne({ empId: managerEmpId });
    //profile.employmentInformation.managerName = user?.name ? user?.name : 'NA';   //Check if this statement is required.
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETPROFILEID');
  }
});
// @route  GET api/profile/user/:teamId
// @desc   Get profile by empId
// @access Private
router.get('/team/:teamId', async (req, res) => {
  try {
    const profile = await Profile.find({
      teamId: req.params.teamId
    });
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile in this Team' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETPROFILETeamID');
  }
});

// @route  GET api/profile/getDirectReports
// @desc   Get profile by empId
// @access Private
router.get('/getDirectReports', auth.verifyUser, async (req, res) => {
  try {
    let profile = await Profile.findOne({
      empId: req.user.empId
    });
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile in this Team' });
    }
    if (!profile.employmentInformation.isManager) {
      return res
        .status(400)
        .json({ msg: 'No direct Reports for this employee' });
    }
    team = profile.employmentInformation.team;
    let teamDetails = [];
    for (let i = 0; i < team.length; i++) {
      member = {};
      if (team[i] !== req.params.empId) {
        let teamMember = await Profile.findOne({
          empId: team[i]
        });
        if (teamMember.employmentInformation.manager === profile.empId) {
          member['empId'] = teamMember.empId;
          member['fullName'] = teamMember.personalInformation.fullName;
          teamDetails.push(member);
        }
      }
    }
    res.json(teamDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETDIRECTREPORTS');
  }
});
module.exports = router;
