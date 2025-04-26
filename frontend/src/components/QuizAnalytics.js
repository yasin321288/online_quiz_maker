import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { AuthContext } from '../context/AuthContext';

// Register Chart.js components
Chart.register(...registerables);

const QuizAnalytics = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [analytics, setAnalytics] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [quizRes, analyticsRes] = await Promise.all([
          axios.get(`/api/quizzes/${id}`),
          axios.get(`/api/results/analytics/${id}`)
        ]);
        
        setQuiz(quizRes.data);
        setAnalytics(analyticsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };
    
    if (user) {
      fetchAnalytics();
    }
  }, [id, user]);
  
  if (!user) {
    return <div className="container mt-5">Please log in to view analytics</div>;
  }
  
  if (loading) {
    return <div className="container mt-5">Loading analytics...</div>;
  }
  
  if (!analytics || !quiz) {
    return <div className="container mt-5">Analytics not available</div>;
  }
  
  // Chart data
  const chartData = {
    labels: ['Average Score', 'Highest Score', 'Lowest Score'],
    datasets: [
      {
        label: 'Score Statistics',
        data: [analytics.averageScore, analytics.highestScore, analytics.lowestScore],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  return (
    <div className="container mt-4">
      <h2>Analytics: {quiz.title}</h2>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3 mb-4">
            <h4>Performance Summary</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <span>Total Attempts:</span>
                <strong>{analytics.totalAttempts}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Average Score:</span>
                <strong>{analytics.averageScore.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Highest Score:</span>
                <strong>{analytics.highestScore}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Lowest Score:</span>
                <strong>{analytics.lowestScore}</strong>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card p-3">
            <h4>Score Distribution</h4>
            <Bar 
              data={chartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    max: quiz.questions.length
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
