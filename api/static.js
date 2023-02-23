const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const StaticData = require('../models/StaticData');

router.get('/static', async (req, res) => {
    try {
        const StaticDataValue = await StaticData.find();
        console.log('staticdata',StaticDataValue);
        res.json(StaticDataValue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error/static');
    }      
});

module.exports = router;