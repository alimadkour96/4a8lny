const Job = require('./job.model');

// Create a new job
const createJob = async (jobData) => {
  try {
    const newJob = new Job(jobData);
    return await newJob.save();
  } catch (error) {
    throw error;
  }
};

// Get all jobs
const getAllJobs = async () => {
  try {
    return await Job.find();
  } catch (error) {
    throw error;
  }
};

// Get a job by ID
const getJobById = async (id) => {
  try {
    return await Job.findById(id);
  } catch (error) {
    throw error;
  }
};


// Update a job
const updateJob = async (id, updatedData) => {
    try {
      return await Job.findByIdAndUpdate(id, updatedData, { new: true });
    } catch (error) {
      throw error;
    }
  };
  
  // Delete a job
  const deleteJob = async (id) => {
    try {
      return await Job.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  };

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
