// src/components/application/application.service.js

const Application = require('./application.model');

const getApplicationsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applications = await Application.find({ job: jobId })
      .populate('employee', 'name')
      .populate('job', 'title');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getApplicationsByJob, updateApplicationStatus };
