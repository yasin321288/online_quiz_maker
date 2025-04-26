import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CreateQuiz = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    isPublic: true,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
  });
  
  const handleChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };
  
  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].question = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };
  
  const handleOptionChange = (qIndex, oIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[oIndex] = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };
  
  const handleCorrectAnswerChange = (index, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].correctAnswer = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };
  
  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
  };
  
  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/quizzes', quizData);
      navigate('/my-quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error.message);
    }
  };
  
  if (!user || !user.isExaminer) {
    return <div className="container mt-5">Only examiners can create quizzes</div>;
  }
  
  return (
    <div className="container mt-4">
      <h2>Create New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={quizData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={quizData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isPublic"
            checked={quizData.isPublic}
            onChange={() => setQuizData({ ...quizData, isPublic: !quizData.isPublic })}
          />
          <label className="form-check-label" htmlFor="isPublic">Make quiz public</label>
        </div>
        
        <h3 className="mt-4">Questions</h3>
        {quizData.questions.map((question, qIndex) => (
          <div key={qIndex} className="card mb-4 p-3">
            <div className="mb-3">
              <label className="form-label">Question {qIndex + 1}</label>
              <input
                type="text"
                className="form-control"
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Options</label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="input-group mb-2">
                  <div className="input-group-text">
                    <input
                      type="radio"
                      name={`correctAnswer-${qIndex}`}
                      checked={question.correctAnswer === option}
                      onChange={() => handleCorrectAnswerChange(qIndex, option)}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    required
                  />
                </div>
              ))}
            </div>
            
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeQuestion(qIndex)}
              disabled={quizData.questions.length <= 1}
            >
              Remove Question
            </button>
          </div>
        ))}
        
        <button type="button" className="btn btn-secondary mb-4" onClick={addQuestion}>
          Add Question
        </button>
        
        <div>
          <button type="submit" className="btn btn-primary">Create Quiz</button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
