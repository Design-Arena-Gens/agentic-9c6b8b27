import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import SignUp from './components/SignUp';
import Login from './components/Login';
import EmployerDashboard from './components/EmployerDashboard';
import JobPostForm from './components/JobPostForm';
import ApplicantList from './components/ApplicantList';
import PublicJobBoard from './components/PublicJobBoard';
import JobDetailsPage from './components/JobDetailsPage';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<PublicJobBoard />} />
            <Route path="/jobs" element={<PublicJobBoard />} />
            <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post-job" 
              element={
                <ProtectedRoute>
                  <JobPostForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/job/:jobId" 
              element={
                <ProtectedRoute>
                  <ApplicantList />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
