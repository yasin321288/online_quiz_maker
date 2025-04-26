const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', quizController.getQuizzes);
router.get('/:id', quizController.getQuizById);

// Protected routes
router.post('/', auth, quizController.createQuiz);
router.get('/user/me', auth, quizController.getMyQuizzes);

module.exports = router;
