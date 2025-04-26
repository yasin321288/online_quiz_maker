import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreateQuiz from './components/CreateQuiz';
import TakeQuiz from './components/TakeQuiz';
import Leaderboard from './components/Leaderboard';
import QuizAnalytics from './components/QuizAnalytics';
import MyQuizzes from './components/MyQuizzes';
import './App.css';

// Configure axios defaults
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/quiz/:id" element={<TakeQuiz />} />
              <Route path="/leaderboard/:id" element={<Leaderboard />} />
              <Route path="/analytics/:id" element={<QuizAnalytics />} />
              <Route path="/my-quizzes" element={<MyQuizzes />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;


