// src/components/application/application.api.js

const express = require('express');
const router = express.Router();
const applicationService = require('./application.service');

// Get applications for a job
router.get('/job/:jobId', applicationService.getApplicationsByJob);

// Update application status
router.patch('/:applicationId', applicationService.updateApplicationStatus);

module.exports = router;
