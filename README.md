<h1>Job API Documentation</h1>
        <p>This API allows users to interact with a job database, providing functionalities such as retrieving, creating, updating, and deleting job postings. Additionally, it offers a unique endpoint to fetch a random joke, adding a little fun to the job search and management process.</p>

<h2>Endpoints</h2>
<ul>
    <li><b>GET /random</b>
        <p>Fetches a random joke.</p>
    </li>
    <li><h2>GET /jobs/:id</h2><p>Retrieves a specific job by its ID.</p>
        </li>
    <li><h2>GET /jobs/filter?topic=type</h2><p>Filters jobs by a specified topic.</p></li>
    <li><h2>POST /jobs</h2><p>Adds a new job to the database.</p></li>
    <li><h2>PUT /jobs/:id</h2></li>
    <li><h2>PATCH /jobs/:id</h2><p>Edits specific details of an existing job.</p></li>
    <li><h2>DELETE /jobs/:id</h2><p>Deletes a specific job from the database.</p></li>
    <li><h2>DELETE /jobs/all</h2><p>Deletes all jobs from the database. Use with caution!</p></li>
</ul>
<h2>Authentication</h2>
            <p>Some endpoints may require authentication. Please ensure to include an appropriate authorization header where necessary.</p>
<h2>Rate Limiting</h2>
            <p>To ensure fair usage, rate limiting is applied to the API. Please be mindful of the number of requests made.</p>
<h2>Error Handling</h2>
            <p>The API uses standard HTTP response codes to indicate the success or failure of requests. In case of errors, a descriptive message will be returned.</p>
