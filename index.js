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

var jobs = [
  {
    id: 1,
    jobText:
      "Why don't scientists trust atoms? Because they make up everything.",
    jobType: "Science",
  },
  {
    id: 2,
    jobText:
      "Why did the scarecrow win an award? Because he was outstanding in his field.",
    jobType: "Puns",
  },
  {
    id: 3,
    jobText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jobType: "Puns",
  },
  {
    id: 4,
    jobText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jobType: "Wordplay",
  },
  {
    id: 5,
    jobText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jobType: "Wordplay",
  },
  {
    id: 6,
    jobText: "How do you organize a space party? You planet!",
    jobType: "Science",
  },
  {
    id: 7,
    jobText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jobType: "Puns",
  },
  {
    id: 8,
    jobText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jobType: "Math",
  },
  {
    id: 9,
    jobText: "What do you call fake spaghetti? An impasta!",
    jobType: "Food",
  },
  {
    id: 10,
    jobText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jobType: "Food",
  },
  {
    id: 11,
    jobText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jobType: "Wordplay",
  },
  {
    id: 12,
    jobText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jobType: "Sports",
  },
  {
    id: 13,
    jobText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jobType: "Wordplay",
  },
  {
    id: 14,
    jobText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jobType: "Movies",
  },
  {
    id: 15,
    jobText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jobType: "Science",
  },
  {
    id: 16,
    jobText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jobType: "Puns",
  },
  {
    id: 17,
    jobText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jobType: "Wordplay",
  },
  {
    id: 18,
    jobText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jobType: "Wordplay",
  },
  {
    id: 19,
    jobText: "How do you organize a space party? You planet!",
    jobType: "Science",
  },
  {
    id: 20,
    jobText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jobType: "Puns",
  },
  {
    id: 21,
    jobText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jobType: "Math",
  },
  {
    id: 22,
    jobText: "What do you call fake spaghetti? An impasta!",
    jobType: "Food",
  },
  {
    id: 23,
    jobText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jobType: "Food",
  },
  {
    id: 24,
    jobText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jobType: "Wordplay",
  },
  {
    id: 25,
    jobText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jobType: "Sports",
  },
  {
    id: 26,
    jobText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jobType: "Wordplay",
  },
  {
    id: 27,
    jobText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jobType: "Movies",
  },
  {
    id: 28,
    jobText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jobType: "Science",
  },
  {
    id: 29,
    jobText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jobType: "Puns",
  },
  {
    id: 30,
    jobText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jobType: "Wordplay",
  },
  {
    id: 31,
    jobText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jobType: "Wordplay",
  },
  {
    id: 32,
    jobText: "How do you organize a space party? You planet!",
    jobType: "Science",
  },
  {
    id: 33,
    jobText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jobType: "Puns",
  },
  {
    id: 34,
    jobText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jobType: "Math",
  },
  {
    id: 35,
    jobText: "What do you call fake spaghetti? An impasta!",
    jobType: "Food",
  },
  {
    id: 36,
    jobText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jobType: "Food",
  },
  {
    id: 37,
    jobText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jobType: "Wordplay",
  },
  {
    id: 38,
    jobText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jobType: "Sports",
  },
  {
    id: 39,
    jobText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jobType: "Wordplay",
  },
  {
    id: 40,
    jobText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jobType: "Movies",
  },
  {
    id: 41,
    jobText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jobType: "Science",
  },
  {
    id: 42,
    jobText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jobType: "Puns",
  },
  {
    id: 43,
    jobText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jobType: "Wordplay",
  },
  {
    id: 44,
    jobText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jobType: "Wordplay",
  },
  {
    id: 45,
    jobText: "How do you organize a space party? You planet!",
    jobType: "Science",
  },
  {
    id: 46,
    jobText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jobType: "Puns",
  },
  {
    id: 47,
    jobText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jobType: "Math",
  },
  {
    id: 48,
    jobText: "What do you call fake spaghetti? An impasta!",
    jobType: "Food",
  },
  {
    id: 49,
    jobText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jobType: "Food",
  },
  {
    id: 50,
    jobText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jobType: "Wordplay",
  },
  {
    id: 51,
    jobText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jobType: "Sports",
  },
  {
    id: 52,
    jobText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jobType: "Wordplay",
  },
  {
    id: 53,
    jobText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jobType: "Movies",
  },
  {
    id: 54,
    jobText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jobType: "Science",
  },
  {
    id: 55,
    jobText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jobType: "Puns",
  },
  {
    id: 56,
    jobText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jobType: "Wordplay",
  },
  {
    id: 57,
    jobText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jobType: "Wordplay",
  },
  {
    id: 58,
    jobText: "How do you organize a space party? You planet!",
    jobType: "Science",
  },
  {
    id: 59,
    jobText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jobType: "Puns",
  },
  {
    id: 60,
    jobText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jobType: "Math",
  },
  {
    id: 61,
    jobText: "What do you call fake spaghetti? An impasta!",
    jobType: "Food",
  },
  {
    id: 62,
    jobText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jobType: "Food",
  },
  {
    id: 63,
    jobText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jobType: "Wordplay",
  },
  {
    id: 64,
    jobText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jobType: "Sports",
  },
  {
    id: 65,
    jobText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jobType: "Wordplay",
  },
  {
    id: 66,
    jobText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jobType: "Movies",
  },
  {
    id: 67,
    jobText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jobType: "Science",
  },
  {
    id: 68,
    jobText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jobType: "Puns",
  },
  {
    id: 69,
    jobText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jobType: "Wordplay",
  },
  {
    id: 70,
    jobText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jobType: "Wordplay",
  },
  {
    id: 71,
    jobText: "How do you organize a space party? You planet!",
    jobType: "Science",
  },
  {
    id: 72,
    jobText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jobType: "Puns",
  },
  {
    id: 73,
    jobText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jobType: "Math",
  },
  {
    id: 74,
    jobText: "What do you call fake spaghetti? An impasta!",
    jobType: "Food",
  },
  {
    id: 75,
    jobText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jobType: "Food",
  },
  {
    id: 76,
    jobText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jobType: "Wordplay",
  },
  {
    id: 77,
    jobText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jobType: "Sports",
  },
  {
    id: 78,
    jobText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jobType: "Wordplay",
  },
  {
    id: 79,
    jobText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jobType: "Movies",
  },
  {
    id: 80,
    jobText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jobType: "Science",
  },
  {
    id: 81,
    jobText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jobType: "Puns",
  },
  {
    id: 82,
    jobText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jobType: "Wordplay",
  },
  {
    id: 83,
    jobText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jobType: "Wordplay",
  },
  {
    id: 84,
    jobText: "How do you organize a space party? You planet!",
    jobType: "Science",
  },
  {
    id: 85,
    jobText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jobType: "Puns",
  },
  {
    id: 86,
    jobText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jobType: "Math",
  },
  {
    id: 87,
    jobText: "What do you call fake spaghetti? An impasta!",
    jobType: "Food",
  },
  {
    id: 88,
    jobText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jobType: "Food",
  },
  {
    id: 89,
    jobText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jobType: "Wordplay",
  },
  {
    id: 90,
    jobText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jobType: "Sports",
  },
  {
    id: 91,
    jobText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jobType: "Wordplay",
  },
  {
    id: 92,
    jobText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jobType: "Movies",
  },
  {
    id: 93,
    jobText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jobType: "Science",
  },
  {
    id: 94,
    jobText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jobType: "Puns",
  },
  {
    id: 95,
    jobText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jobType: "Wordplay",
  },
  {
    id: 96,
    jobText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jobType: "Wordplay",
  },
  {
    id: 97,
    jobText: "How do you organize a space party? You planet!",
    jobType: "Science",
  },
  {
    id: 98,
    jobText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jobType: "Puns",
  },
  {
    id: 99,
    jobText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jobType: "Math",
  },
  {
    id: 100,
    jobText: "What do you call fake spaghetti? An impasta!",
    jobType: "Food",
  },
];
