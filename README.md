<h1>Running the App</h1>
<h3>Backend</h3>
<p> Before running the commands, you should assign the value of the database-related information in the .env and docker-compose.yaml files. You should also assign the value of the JWT_SECRET in .env file. </p>
<pre><code>
$ cd backend
$ npm install
$ docker compose up -d
$ npx prisma generate
$ npx prisma migrate dev
$ npx prisma db push
$ npm run dev
</code></pre>

<h3>Frontend</h3>
<pre><code>
$ cd frontend
$ npm install
$ npm run dev
</code></pre>

<h1>Running the tests</h1>

<h3>Backend</h3>
The backend needs a database to execute tests.
<pre><code>
$ docker compose up -d
$ npm test
</code></pre>

<h3>Frontend</h3>
<pre><code>
$ npm test
</code></pre>


<h1>Some Technologies Used in the Frontend</h1>
<ul>
  <li>Next</li>    
  <li>React</li>
  <li>Node.js</li>  
  <li>TypeScript</li>
  <li>React Testing Library</li>
</ul>

<h2>Some Images of the Frontend</h2>
<p align="center">
  <img src="https://github.com/k-santos/todolist/assets/143345722/984c3b31-9544-4e8a-9b90-a4b56be177d9" width="45%">
  <img src="https://github.com/k-santos/todolist/assets/143345722/7249b6e0-117a-4c7b-bea0-f899c268fa0b" width="45%">
</p>

<p align="center">
  <img src="https://github.com/k-santos/todolist/assets/143345722/82e3db15-b879-4e3e-b823-f8fbc9624ded" width="90%">
</p>

<p align="center">
  <img src="https://github.com/k-santos/todolist/assets/143345722/a4fd633d-49c2-4928-b8ba-dbb596ae7acf" width="45%">
  <img src="https://github.com/k-santos/todolist/assets/143345722/410abe0a-8983-452d-b356-00a39dcd6e4d" width="45%">
</p>

<h1>Some Technologies Used in the Backend</h1>
<ul>
  <li>TypeScript</li>
  <li>Node.js</li>
  <li>Express</li>
  <li>Prisma</li>
  <li>PostgreSQL</li>
  <li>Jest</li>
  <li>JWT</li>
  <li>Docker</li>  
</ul>

<h2>Backend Organization</h2>
<p>Some backend routes are public and others are private. There is a middleware that validates private routes. In general:</p>
<ul>
  <li>The controller receives the request and validates its data.</li>
  <li>The service accesses the database to retrieve or update some data.</li>
  <li>Finally, the controller returns the response to the client.</li>
</ul>

<p align="center">
  <img src="https://github.com/k-santos/todolist/assets/143345722/632769ae-56db-4dda-8216-961a9d29b0ed" width="90%">
</p>
