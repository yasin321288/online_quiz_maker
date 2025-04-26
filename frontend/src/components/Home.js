import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quizzes');
        setQuizzes(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  return (
    <div className="home-container">
      <h2>Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <div className="alert alert-info">No quizzes available yet</div>
      ) : (
        <div className="row">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{quiz.title}</h5>
                  <p className="card-text">{quiz.description}</p>
                  <p className="text-muted">By: {quiz.creator.username}</p>
                </div>
                <div className="card-footer">
                  <Link to={`/quiz/${quiz._id}`} className="btn btn-primary">
                    Take Quiz
                  </Link>
                  <Link to={`/leaderboard/${quiz._id}`} className="btn btn-outline-secondary ms-2">
                    Leaderboard
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
     
    </div>
  );
};

export default Home;


