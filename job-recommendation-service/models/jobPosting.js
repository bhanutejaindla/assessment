const mongoose = require('mongoose');


const jobPostingSchema = new mongoose.Schema({
    job_id: Number,
    job_title: String,
    company: String,
    required_skills: [String],
    location: String,
    job_type: String,
    experience_level: String
});


module.exports = mongoose.model('JobPosting', jobPostingSchema);
