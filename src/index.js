const express = require('express');
const cors = require('cors');
require('dotenv').config();

const imagesRouter = require('./routes/images');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/images', imagesRouter);

app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    provider: 'pinterest'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
