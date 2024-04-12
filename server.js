const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/upload', req.body);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading document');
  }
});

app.post('/query', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/query', req.body);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error querying document');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});