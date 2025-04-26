const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

// Submit quiz result
exports.submitResult = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    
    // Get the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });
    
    // Save result
    const result = new Result({
      quiz: quizId,
      user: req.user.id,
      score,
      totalQuestions: quiz.questions.length
    });
    
    await result.save();
    
    res.status(201).json({
      score,
      totalQuestions: quiz.questions.length,
      percentage: (score / quiz.questions.length) * 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get leaderboard for a quiz
exports.getLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const leaderboard = await Result.find({ quiz: quizId })
      .sort('-score')
      .limit(10)
      .populate('user', 'username')
      .select('score totalQuestions attemptedAt');
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get analytics for a quiz
exports.getAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    // Check if user is the creator of the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    if (quiz.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Get quiz analytics
    const results = await Result.find({ quiz: quizId });
    
    const analytics = {
      totalAttempts: results.length,
      averageScore: results.reduce((acc, curr) => acc + curr.score, 0) / (results.length || 1),
      highestScore: Math.max(...results.map(r => r.score), 0),
      lowestScore: results.length ? Math.min(...results.map(r => r.score)) : 0
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
