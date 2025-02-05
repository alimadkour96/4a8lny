const express = require('express');
const router = express.Router();
const jobService = require('../job/job.service');

// Create a new job
router.post('/', async (req, res) => {
  try {
    const newJob = await jobService.createJob(req.body);
    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });
  }
});

// Get a job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve job' });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
    try {
        const updatedJob = await jobService.updateJob(req.params.id, req.body);
        if (!updatedJob) {
          return res.status(404).json({ error: 'Job not found' });
        }
        res.json(updatedJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update job' });
    }
});

// Delete a job
router.delete('/:id', async (req, res) => {
    try {
        const deletedJob = await jobService.deleteJob(req.params.id);
        if (!deletedJob) {
          return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
});


module.exports = router;