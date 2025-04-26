const Quiz = require('../models/Quiz');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions, isPublic } = req.body;
    
    const quiz = new Quiz({
      title,
      description,
      questions,
      isPublic,
      creator: req.user.id
    });
    
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublic: true })
      .select('title description creator createdAt')
      .populate('creator', 'username');
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('creator', 'username');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get quizzes created by the user
exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user.id })
      .select('title description isPublic createdAt');
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
