import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const PORT = process.env.PORT || 8000;

let app = express();

app.get('/helloworld', (req, res) => {
  res.send('Hello World');
});

const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

module.exports = {
  stopServer: () => {
    console.log('Stopping server on port', PORT);
    server.close();
  },

  app: app,
};
