const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const UserProfile = require('./models/userProfiles.js');
const JobPosting = require('./models/jobPosting.js');

app.use(express.json());


const jobPostings = [
    {
        job_id: 1,
        job_title: "Software Engineer",
        company: "Tech Solutions Inc.",
        required_skills: ["JavaScript", "React", "Node.js"],
        location: "San Francisco",
        job_type: "Full-Time",
        experience_level: "Intermediate",
    },
    {
        job_id: 2,
        job_title: "Data Scientist",
        company: "Data Analytics Corp.",
        required_skills: ["Python", "Data Analysis", "Machine Learning"],
        location: "Remote",
        job_type: "Full-Time",
        experience_level: "Intermediate",
    },
    {
        job_id: 3,
        job_title: "Frontend Developer",
        company: "Creative Designs LLC",
        required_skills: ["HTML", "CSS", "JavaScript", "Vue.js"],
        location: "New York",
        job_type: "Part-Time",
        experience_level: "Junior",
    },
    {
        job_id: 4,
        job_title: "Backend Developer",
        company: "Web Services Co.",
        required_skills: ["Python", "Django", "REST APIs"],
        location: "Chicago",
        job_type: "Full-Time",
        experience_level: "Senior",
    },
    {
        job_id: 5,
        job_title: "Machine Learning Engineer",
        company: "AI Innovations",
        required_skills: ["Python", "Machine Learning", "TensorFlow"],
        location: "Boston",
        job_type: "Full-Time",
        experience_level: "Intermediate",
    },
    {
        job_id: 6,
        job_title: "DevOps Engineer",
        company: "Cloud Networks",
        required_skills: ["AWS", "Docker", "Kubernetes"],
        location: "Seattle",
        job_type: "Full-Time",
        experience_level: "Senior",
    },
    {
        job_id: 7,
        job_title: "Full Stack Developer",
        company: "Startup Hub",
        required_skills: ["JavaScript", "Node.js", "Angular", "MongoDB"],
        location: "Austin",
        job_type: "Full-Time",
        experience_level: "Intermediate",
    },
    {
        job_id: 8,
        job_title: "Data Analyst",
        company: "Finance Analytics",
        required_skills: ["SQL", "Python", "Tableau"],
        location: "New York",
        job_type: "Full-Time",
        experience_level: "Junior",
    },
    {
        job_id: 9,
        job_title: "Quality Assurance Engineer",
        company: "Reliable Software",
        required_skills: ["Selenium", "Java", "Testing"],
        location: "San Francisco",
        job_type: "Contract",
        experience_level: "Intermediate",
    },
    {
        job_id: 10,
        job_title: "Systems Administrator",
        company: "Enterprise Solutions",
        required_skills: ["Linux", "Networking", "Shell Scripting"],
        location: "Remote",
        job_type: "Full-Time",
        experience_level: "Senior",
    },
];
// Route to insert mock data
app.get('/insert_mock_data', async (req, res) => {
    try {
        await JobPosting.insertMany(jobPostings);
        res.status(200).json({ message: "Mock job postings added to MongoDB" });
    } catch (err) {
        console.error("Error adding mock job postings: ", err);
        res.status(500).json({ error: "Error adding mock job postings" });
    }
});

// Add User Profile
app.post('/user_profile', async (req, res) => {
    try {
        const profile = new UserProfile(req.body);
        await profile.save();
        res.status(201).json({ message: "User profile added successfully!" });
    } catch (error) {
        console.error("Error adding user profile:", error);
        res.status(500).json({ error: "Error adding user profile" });
    }
});


app.get('/recommend_jobs', async (req, res) => {
    try {
        const userName = req.query.name;
        console.log(`Fetching profile for user: ${userName}`);

        const userProfile = await UserProfile.findOne({ name: userName });

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found!" });
        }

        console.log("User Profile:", userProfile);

        // Fetch all job postings
        const jobPostings = await JobPosting.find();

        

        // Filter recommended jobs based on matching criteria
        const recommendedJobs = jobPostings.filter(job => {
            console.log(`Evaluating job: ${job.job_title}`);

            // Check if the user has at least one matching skill
            const skillsMatch = userProfile.skills.some(skill => job.required_skills.includes(skill));
            console.log(`Skills Match for ${job.job_title}:`, skillsMatch);

            // Check if the job role matches the user's desired roles and job type
            const rolesMatch = userProfile.preferences.desired_roles.includes(job.job_title);
            console.log(`Roles Match for ${job.job_title}:`, rolesMatch);

            // Check if the job location matches one of the user's preferred locations
            const locationMatch = userProfile.preferences.locations.includes(job.location);
            console.log(`Location Match for ${job.job_title}:`, locationMatch);

            // Check if the job type matches the user's preferences
            const jobTypeMatch = userProfile.preferences.job_type === job.job_type;
            console.log(`Job Type Match for ${job.job_title}:`, jobTypeMatch);

            // Return jobs where at least one skill matches, and role, location, and job type match
            return skillsMatch && rolesMatch || locationMatch || jobTypeMatch;
        });

        console.log("Recommended Jobs:", recommendedJobs);

        // If no jobs are found, return an appropriate message
        if (recommendedJobs.length === 0) {
            return res.status(200).json({ message: "No matching job postings found." });
        }

        // Return the recommended jobs
        res.status(200).json(recommendedJobs);
    } catch (error) {
        console.error("Error fetching job recommendations:", error);
        res.status(500).json({ error: "Error fetching job recommendations" });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
