import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const url = "mongodb://localhost:27017/Job_Search_API"; // Corrected to use 'mongodb://'
const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

//creating a ejs as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Specify the directory for views

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connecting to MongoDB
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database not connected due to - ", error);
  });

// Define the schema for jobs
const apiSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  jobType: String,
  jobText: String,
});

// Create the model
const api_1 = mongoose.model("api_1", apiSchema, "api_1");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const allJobs = await api_1.find();
  res.render("index", { jobs: allJobs });
});

//1. GET a random joke'

app.get("/random", (req, res) => {
  const jobGet = Math.floor(Math.random() * jobs.length);
  res.json(jobs[jobGet]);
});

// 2. GET a specific job
app.get("/jobs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const foundJob = await api_1.findById(id);
    if (!foundJob) return res.status(404).send("Job not found");
    res.json(foundJob);
  } catch (error) {
    res.status(500).send("Error fetching job: " + error.message);
  }
});

// 3. GET jobs by filtering on the job type
app.get("/filter", async (req, res) => {
  const type = req.query.type;
  try {
    const findType = await api_1.find({ jobType: type });
    if (findType.length === 0)
      return res.status(404).send("No jobs found of that type");
    res.json(findType);
  } catch (error) {
    res.status(500).send("Error filtering jobs: " + error.message);
  }
});

// 4. POST a new job
app.post("/jobs", async (req, res) => {
  const countAll = await api_1.countDocuments();
  const jobText1 = req.body.text;
  const jobType1 = req.body.type;
  const newJob = new api_1({
    _id: countAll + 1, // Assigning a new unique ID
    jobText: jobText1,
    jobType: jobType1,
  });

  try {
    const savedJob = await newJob.save();
    res.redirect("/");
  } catch (error) {
    res.status(400).send("Error posting new job: " + error.message);
  }
});

app.get("/post-job", (req, res) => {
  res.render("jobPosting");
});

// 5. PUT a job
app.put("/jobs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const jobText1 = req.body.text;
  const jobType1 = req.body.type;

  try {
    const updatedJob = await api_1.findByIdAndUpdate(
      id,
      { jobText: jobText1, jobType: jobType1 },
      { new: true, runValidators: true }
    );
    if (!updatedJob) return res.status(404).send("Job not found");
    res.json(updatedJob);
  } catch (error) {
    res.status(400).send("Error updating job: " + error.message);
  }
});

// 6. PATCH a job
app.patch("/jobs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updateFields = {};

  if (req.body.text) updateFields.jobText = req.body.text;
  if (req.body.type) updateFields.jobType = req.body.type;

  try {
    const updatedJob = await api_1.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!updatedJob) return res.status(404).send("Job not found");
    res.json(updatedJob);
  } catch (error) {
    res.status(400).send("Error updating job: " + error.message);
  }
});

// 7. DELETE Specific job
app.delete("/jobs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedJob = await api_1.findByIdAndDelete(id);
    if (!deletedJob) return res.status(404).send("Job not found");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send("Error deleting job: " + error.message);
  }
});

// 8. DELETE All jobs
app.delete("/jobs/all", async (req, res) => {
  const deleteKey = req.body.key;
  if (deleteKey === masterKey) {
    try {
      await api_1.deleteMany({});
      res.sendStatus(200);
      console.log("All jobs deleted");
    } catch (error) {
      res.status(500).send("Error deleting jobs: " + error.message);
    }
  } else {
    res.sendStatus(400);
    console.log("Wrong key, nothing deleted");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
