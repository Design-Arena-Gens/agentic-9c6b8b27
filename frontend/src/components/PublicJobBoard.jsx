import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PublicJobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/public`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.jobs);
      setFilteredJobs(data.jobs);
    } catch (error) {
      setError('Failed to load jobs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter(job => 
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your Next Opportunity
        </h1>
        <p className="text-gray-600 text-lg">
          Browse thousands of jobs from top companies
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by job title, location, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchTerm ? 'No jobs found matching your search.' : 'No jobs available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {job.jobTitle}
              </h2>
              <p className="text-gray-700 font-medium mb-1">{job.companyName}</p>
              <p className="text-gray-500 mb-2">{job.location}</p>
              {job.salaryRange && (
                <p className="text-green-600 font-medium">{job.salaryRange}</p>
              )}
              <div className="mt-4 text-blue-600 font-medium">
                View Details →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicJobBoard;
