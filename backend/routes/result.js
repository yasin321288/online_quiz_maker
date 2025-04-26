const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const auth = require('../middleware/auth');

router.post('/submit', auth, resultController.submitResult);
router.get('/leaderboard/:quizId', resultController.getLeaderboard);
router.get('/analytics/:quizId', auth, resultController.getAnalytics);

module.exports = router;
