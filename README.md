<h1>Job API Documentation</h1>
        <p>This API allows users to interact with a job database, providing functionalities such as retrieving, creating, updating, and deleting job postings. Additionally, it offers a unique endpoint to fetch a random joke, adding a little fun to the job search and management process.</p>

<h2>Endpoints</h2>
<ul>
    <li><h2>GET /jobs/:id</h2><p>Retrieves a specific job by its ID.</p></li>
    <li><h2>GET /jobs/filter?topic=type</h2><p>Filters jobs by a specified topic.</p></li>
    <li><h2>POST /jobs</h2><p>Adds a new job to the database.</p></li>
    <li><h2>PUT /jobs/:id</h2><p>Updates the job with given id</p></li>
    <li><h2>PATCH /jobs/:id</h2><p>Edits specific details of an existing job.</p></li>
    <li><h2>DELETE /jobs/:id</h2><p>Deletes a specific job from the database.</p></li>
</ul>
