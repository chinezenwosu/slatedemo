import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const PORT = process.env.PORT || 8000;

let app = express();

app.get('*', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
