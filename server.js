const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Task 3.1: Last visit time
let lastVisit = null;

// Task 3.2: Color cycling (HTML route)
const colors = ['red', 'yellow', 'green', 'blue'];
let colorIndex = 0;

// Task 3.3: Visit log timestamps (HTML)
const visitLog = [];

// Task 3.4: First visit tracking
let firstPageVisited = false;

// Task 4.2: Separate AJAX color cycle
const ajaxColors = ['red', 'yellow', 'green', 'blue'];
let ajaxColorIndex = 0;

// Task 4.3: AJAX log tracking
const ajaxVisitLog = [];

// Task 4.5: Accept terms route
let termsAccepted = false;

// Task 4.6: Rotating picture gallery
const images = [
  { uri:'photo-1539154444419-e31272d30a31.jpg', description:'medium-coated black-and-white dog near grass during daytime' },
  { uri:'photo-1553882809-a4f57e59501d.jpg', description:'black and tan Belgian dog' },
  { uri:'photo-1554196721-b507d7e86ee9.jpg', description:'gray dog standing on grass' },
  { uri:'photo-1555661059-7e755c1c3c1d.jpg', description:'black dog behind plants' },
  { uri:'photo-1555991415-1b04a71f18c5.jpg', description:'adult white Samoyed beside man and woman' },
  { uri:'photo-1558121591-b684092bb548.jpg', description:'white and black dog lying on sofa' },
  { uri:'photo-1559440165-065646588e9a.jpg', description:'person holding dog leash short-coat black and white dog' },
  { uri:'photo-1560160643-7c9c6cb07a8b.jpg', description:'short-coated brown and white dog' },
  { uri:'photo-1562220058-1a0a019ab606.jpg', description:'pet dog laying on sofa' },
  { uri:'photo-1565194481104-39d1ee1b8bcc.jpg', description:'short-coated gray dog' }
];
let imageIndex = 0;

// Task 4.7: Blog posts data
const posts = require('./routes/posts');

app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Task 3.1: /last.txt
app.get('/last.txt', (req, res) => {
  const currentTime = new Date().toISOString();
  const output = lastVisit || '';
  lastVisit = currentTime;
  res.type('text').send(output);
});

// Task 3.2: /color.html
app.get('/color.html', (req, res) => {
  const color = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Color Page</title>
    </head>
    <body>
      <h1 style="color:${color}">${color}</h1>
    </body>
    </html>
  `);
});

// Task 3.3: /log.html
app.get('/log.html', (req, res) => {
  const now = new Date().toISOString();
  visitLog.push(now);
  const listItems = visitLog.map(t => `<li>${t}</li>`).join('\n');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Visit Log</title>
    </head>
    <body>
      <h1>Visit Log</h1>
      <ul>${listItems}</ul>
    </body>
    </html>
  `);
});

// Task 3.4: /first.html
app.get('/first.html', (req, res) => {
  if (firstPageVisited) return res.redirect('/main.html');
  firstPageVisited = true;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><title>First Visit</title></head>
    <body>
      <h1>Welcome</h1>
      <a href="/main.html">Continue to Main Page</a>
    </body>
    </html>
  `);
});

// Task 3.4: /main.html
app.get('/main.html', (req, res) => {
  if (!firstPageVisited) return res.redirect('/first.html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><title>Main Site</title></head>
    <body>
      <h1>My main site</h1>
      <p>Nothing to see here… or is there?</p>
    </body>
    </html>
  `);
});

// Task 4.2: /color.txt
app.get('/color.txt', (req, res) => {
  const color = ajaxColors[ajaxColorIndex];
  ajaxColorIndex = (ajaxColorIndex + 1) % ajaxColors.length;
  res.type('text').send(color);
});

// Task 4.3: /log.json
app.get('/log.json', (req, res) => {
  const now = new Date().toString();
  ajaxVisitLog.push(now);
  res.json(ajaxVisitLog);
});

// Task 4.3: /log-ro.json
app.get('/log-ro.json', (req, res) => {
  res.json(ajaxVisitLog);
});

// Task 4.4: /contact.ajax
app.get('/contact.ajax', (req, res) => {
  res.send('<a href="mailto:rusheek.saravanan@adelaide.edu.au">Email Rusheek</a>');
});

// Task 4.4: /search.ajax
app.get('/search.ajax', (req, res) => {
  res.send(`
    <input type="text" placeholder="Search..." />
    <button>Search</button>
  `);
});

// Task 4.5: Accept terms route
app.get('/accept', (req, res) => {
  termsAccepted = true;
  res.sendStatus(200);
});

// Task 4.5: Protected content route
app.get('/content.ajax', (req, res) => {
  if (!termsAccepted) {
    return res.sendStatus(403);
  }
  res.send(`
    <p>Thank you for accepting the terms and conditions.</p>
    <p>You now have access to this exclusive content!</p>
  `);
});

// Task 4.6: /images.json
app.get('/images.json', (req, res) => {
  const image = images[imageIndex];
  imageIndex = (imageIndex + 1) % images.length;
  res.json(image);
});

// Task 4.7: /posts.json
app.get('/posts.json', (req, res) => {
  let { first, num } = req.query;

  first = parseInt(first);
  num = parseInt(num);

  const isValidFirst = !isNaN(first) && first >= 0;
  const isValidNum = !isNaN(num) && num >= 1;

  const start = isValidFirst ? first : 0;
  const end = isValidNum ? start + num : undefined;

  res.json(posts.slice(start, end));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
