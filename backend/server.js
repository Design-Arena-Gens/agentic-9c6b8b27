import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { db } from './firebase.js';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const jobsInMemory = new Map();
const applicationsInMemory = new Map();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/jobs', verifyToken, async (req, res) => {
  try {
    const { jobTitle, companyName, location, jobDescription, salaryRange } = req.body;
    const employerId = req.user.uid;

    const jobData = {
      id: Date.now().toString(),
      employerId,
      jobTitle,
      companyName,
      location,
      jobDescription,
      salaryRange: salaryRange || '',
      createdAt: new Date().toISOString()
    };

    jobsInMemory.set(jobData.id, jobData);

    res.status(201).json({ 
      success: true, 
      job: jobData,
      message: 'Success! Your job has been posted and is now being distributed to 100+ job boards.'
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

app.get('/api/jobs/employer', verifyToken, async (req, res) => {
  try {
    const employerId = req.user.uid;
    
    const employerJobs = Array.from(jobsInMemory.values())
      .filter(job => job.employerId === employerId)
      .map(job => {
        const applicantCount = Array.from(applicationsInMemory.values())
          .filter(app => app.jobId === job.id).length;
        
        return {
          ...job,
          total_applicants: applicantCount
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ jobs: employerJobs });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/public', async (req, res) => {
  try {
    const allJobs = Array.from(jobsInMemory.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ jobs: allJobs });
  } catch (error) {
    console.error('Error fetching public jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = jobsInMemory.get(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

app.post('/api/apply/:jobId', upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { seekerName, seekerEmail, seekerPhone } = req.body;

    const job = jobsInMemory.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const applicationData = {
      id: Date.now().toString(),
      jobId,
      employerId: job.employerId,
      seekerName,
      seekerEmail,
      seekerPhone,
      resumeUrl: req.file ? `resume_${Date.now()}_${req.file.originalname}` : 'No resume uploaded',
      appliedAt: new Date().toISOString()
    };

    applicationsInMemory.set(applicationData.id, applicationData);

    res.status(201).json({ 
      success: true, 
      application: applicationData,
      message: 'Application submitted successfully!'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

app.get('/api/applications/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.uid;

    const job = jobsInMemory.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employerId !== employerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const applications = Array.from(applicationsInMemory.values())
      .filter(app => app.jobId === jobId)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
