const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true
    },
    teamId: {
      type: String
    },
    personalInformation: {
      fullName: {
        type: String,
        required: true
      },
      dob: {
        type: Date 
        // required:true
      },
      birthCountry: {
        type: {} //changed from string to array of objects 
      },
      birthPlace: {
        type: {} //changed from string to array of objects
      },
      gender: {
        type: String
        // required:true
      },
      nationality: {
        type: {} //changed from string to array of objects
      },
      contactNumber: {
        type: String
      },
      aboutMe: {
        type: String
      }
    },
    employmentInformation: {
      dateOfEmployment: {
        type: Date 
      },
      currentRole: {
        type: String
      },
      department: {
        type: String
      },
      manager: {
        type: String
      },
      managerName: {
        type: String
      },
      workEx: {
        type: String
      },
      isManager: {
        type: Number
      },
      team: {
        type: [{}]
      },
      teamTechStack: {
        type: [{}]
      },
      currentProject: {
        type: String
      },
      hardSkills: {
        type: [{}]
      },
      softSkills: {
        type: [{}]
      },
      personalityMindAttr: {
        type: [{}]
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);
