var express = require('express');
var router = express.Router();

/* GET API endpoint */
router.get('/api/status', function(req, res, next) {
    res.json({
        status: 'ok',
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

/* GET API endpoint with data */
router.get('/api/info', function(req, res, next) {
    res.json({
        application: 'vulnerable-node',
        version: '1.0',
        endpoints: [
            '/api/status',
            '/api/info'
        ]
    });
});

module.exports = router;
