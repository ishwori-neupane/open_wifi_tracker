const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const cors = require('cors');
const router = require('./routes/route');
const multer = require('multer');
const upload = multer();

app.use(upload.none());

// Use built-in middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin:"*",
    methods: ['POST', 'GET', 'PUT'],
    credentials: true,
  })
);
app.post('/form-data', (req, res) => {
  // Access form data fields
  const formData = req.body;
  // Process the form data

  res.send('Form data received');
});

app.use("/",router);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
