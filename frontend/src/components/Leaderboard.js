import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [quizRes, leaderboardRes] = await Promise.all([
          axios.get(`/api/quizzes/${id}`),
          axios.get(`/api/results/leaderboard/${id}`)
        ]);
        
        setQuiz(quizRes.data);
        setLeaderboard(leaderboardRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [id]);
  
  if (loading) {
    return <div className="container mt-5">Loading leaderboard...</div>;
  }
  
  if (!quiz) {
    return <div className="container mt-5">Quiz not found</div>;
  }
  
  return (
    <div className="container mt-4">
      <h2>Leaderboard: {quiz.title}</h2>
      
      {leaderboard.length === 0 ? (
        <div className="alert alert-info">No attempts yet for this quiz</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.user.username}</td>
                <td>{entry.score} / {entry.totalQuestions}</td>
                <td>{((entry.score / entry.totalQuestions) * 100).toFixed(2)}%</td>
                <td>{new Date(entry.attemptedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
