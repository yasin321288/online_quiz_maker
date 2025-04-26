import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TakeQuiz = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/quizzes/${id}`);
        setQuiz(res.data);
        // Initialize answers array with empty strings
        setAnswers(Array(res.data.questions.length).fill(''));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [id]);
  
  const handleAnswerSelect = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmitQuiz = async () => {
    try {
      if (!user) {
        alert('Please log in to submit your quiz');
        return;
      }
      
      const res = await axios.post('/api/results/submit', {
        quizId: id,
        answers
      });
      
      setResult(res.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };
  
  if (loading) {
    return <div className="container mt-5">Loading quiz...</div>;
  }
  
  if (!quiz) {
    return <div className="container mt-5">Quiz not found</div>;
  }
  
  if (result) {
    return (
      <div className="container mt-5">
        <div className="card p-4">
          <h2>Quiz Completed!</h2>
          <div className="alert alert-success">
            <h4>Your Score: {result.score} out of {result.totalQuestions}</h4>
            <h5>Percentage: {result.percentage.toFixed(2)}%</h5>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/leaderboard/${id}`)}
          >
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }
  
  const question = quiz.questions[currentQuestion];
  
  return (
    <div className="container mt-4">
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      
      <div className="progress mb-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          aria-valuenow={currentQuestion + 1}
          aria-valuemin="0"
          aria-valuemax={quiz.questions.length}
        >
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>
      
      <div className="card p-4 mb-4">
        <h4>{question.question}</h4>
        
        <div className="mt-3">
          {question.options.map((option, index) => (
            <div key={index} className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name={`question-${currentQuestion}`}
                id={`option-${index}`}
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => handleAnswerSelect(option)}
              />
              <label className="form-check-label" htmlFor={`option-${index}`}>
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleNextQuestion}
            disabled={!answers[currentQuestion]}
          >
            Next
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={handleSubmitQuiz}
            disabled={!answers[currentQuestion]}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
