const mongoose = require('mongoose');

const StaticDataSchema = new mongoose.Schema({
    Status: {
        type: [{}]
    },
    gendervalue: {
        type: [{}]
    },
    hardskills: {
        type: [{}]
    },
    personalityMindAttr: {
        type: [{}]
    },
    softskills: {
        type: [{}]
    },
    team: {
        type: [{}]
    },
    teamTechStack: {
        type: [{}]
    }
});
// },
//     {
//       timestamps: true
// });
module.exports = StaticData = mongoose.model('static', StaticDataSchema);