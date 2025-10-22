import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/employer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      setError('Failed to load jobs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Employer Dashboard</h1>
        <Link
          to="/post-job"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Post New Job
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">
            You haven't posted any jobs yet.
          </p>
          <Link
            to="/post-job"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/dashboard/job/${job.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {job.jobTitle}
                  </h2>
                  <p className="text-gray-600 mb-1">{job.companyName}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                  {job.salaryRange && (
                    <p className="text-gray-500 text-sm mt-1">{job.salaryRange}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg">
                    {job.total_applicants} Applicants
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
