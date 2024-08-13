import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

app.use(bodyParser.urlencoded({ extended: true }));

//1. GET a random job

app.get("/random",(req,res)=>{
  const jobGet = Math.floor(Math.random()*jobs.length);
  res.json(jobs[jobGet]);
});

//2. GET a specific job
app.get("/jobs/:id",(req,res)=>{
  const id = parseInt(req.params.id);
  const foundjob = jobs.find((job)=> job.id===id);
  res.json(foundjob);
});

//3. GET a jobs by filtering on the job type
app.get("/filter",(req,res)=>{
  const type = req.query.type;
  const findType = jobs.filter((job)=> job.jobType === type);
  res.json(findType);
});
//4. POST a new job
app.post("/jobs",(req,res)=>{
  const newjob = {
    id: jobs.length + 1,
    jobText: req.body.text,
    jobType: req.body.type,
  };
  jobs.push(newjob);
  console.log(jobs.slice(-1));
  res.json(newjob);
});
//5. PUT a job
app.put("/jobs/:id",(req,res)=>{
  const id = parseInt(req.params.id);
  const putjob = {
    id: id,
    jobText: req.body.text,
    jobType: req.body.type,
  };
  const index = jobs.findIndex((job)=> job.id===id);
  jobs[index] = putjob;
  res.json(putjob);
});
//6. PATCH a job
app.patch("/jobs/:id",(req,res)=>{
  const id = parseInt(req.params.id);
  const existingjob = jobs.find((job)=> job.id===id);
  const patchjob ={
    id: id,
    jobText: req.body.text || existingjob.jobText,
    jobType: req.body.type || existingjob.jobType,
  };
  const patchIndex = jobs.findIndex((job)=> job.id === id);
  jobs[patchIndex] = patchjob;
  console.log(jobs[patchIndex]);
  res.json(patchjob);
});
//7. DELETE Specific job
app.delete("/jobs/:id",(req,res)=>{
  const id = parseInt(req.params.id);
  const findIndex = jobs.findIndex((job)=> job.id === id);
  if(findIndex>-1){
    jobs.splice(findIndex,1);
    res.sendStatus(200);
    console.log("Successfully Removed");
  }
  else{
    res.sendStatus(400);
    console.log("No such Id exists, Nothing got deleted ");
  };
});
//8. DELETE All jobs
app.delete("jobs/all",(req,res)=>{
  const deleteKey = req.body.key;
  if(deleteKey===masterKey){
    res.sendStatus(200);
    console.log("all Deleted");
  }else{
    res.sendStatus(400);
    console.log("Wrong key, Nothing Deleted ");
  }
})

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

var jobs = [];
