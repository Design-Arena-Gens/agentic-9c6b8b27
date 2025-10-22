import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    seekerName: '',
    seekerEmail: '',
    seekerPhone: '',
    resume: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`);
      
      if (!response.ok) {
        throw new Error('Job not found');
      }

      const data = await response.json();
      setJob(data.job);
    } catch (error) {
      setError('Failed to load job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setFormData({
        ...formData,
        resume: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('seekerName', formData.seekerName);
      formDataToSend.append('seekerEmail', formData.seekerEmail);
      formDataToSend.append('seekerPhone', formData.seekerPhone);
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/apply/${jobId}`,
        {
          method: 'POST',
          body: formDataToSend
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await response.json();
      setSubmitSuccess(data.message);
      setFormData({
        seekerName: '',
        seekerEmail: '',
        seekerPhone: '',
        resume: null
      });
      
      document.getElementById('resume').value = '';
    } catch (error) {
      setSubmitError('Failed to submit application: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Job not found'}
        </div>
        <Link to="/jobs" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/jobs" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Back to Jobs
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{job.jobTitle}</h1>
        <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
          <div className="flex items-center">
            <span className="font-medium">{job.companyName}</span>
          </div>
          <div className="flex items-center">
            <span>{job.location}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center">
              <span className="text-green-600 font-medium">{job.salaryRange}</span>
            </div>
          )}
        </div>
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{job.jobDescription}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply Now</h2>

        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {submitSuccess}
          </div>
        )}

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="seekerName"
              value={formData.seekerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              name="seekerEmail"
              value={formData.seekerEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="seekerPhone"
              value={formData.seekerPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Resume *
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleChange}
              required
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-sm mt-1">
              Accepted formats: PDF, DOC, DOCX
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobDetailsPage;
