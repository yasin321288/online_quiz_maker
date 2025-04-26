import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyQuizzes = () => {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quizzes/user/me');
        setQuizzes(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoading(false);
      }
    };
    
    if (user) {
      fetchQuizzes();
    }
  }, [user]);
  
  if (!user) {
    return <div className="container mt-5">Please log in to view your quizzes</div>;
  }
  
  if (loading) {
    return <div className="container mt-5">Loading quizzes...</div>;
  }
  
  return (
    <div className="container mt-4">
      <h2>My Quizzes</h2>
      {quizzes.length === 0 ? (
        <div className="alert alert-info">You haven't created any quizzes yet</div>
      ) : (
        <div className="row">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{quiz.title}</h5>
                  <p className="card-text">{quiz.description}</p>
                  <p className="text-muted">Created at: {new Date(quiz.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="card-footer">
                  <Link to={`/analytics/${quiz._id}`} className="btn btn-primary">
                    View Analytics
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

export default MyQuizzes;
