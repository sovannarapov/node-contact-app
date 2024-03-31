const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const database = require('./config/database');
require('dotenv').config();

database();
const app = express();

const port = process.env.PORT || 8002;

app.use(express.json());
app.use('/api/contacts', require('./routes/contact'));
app.use('/api/users', require('./routes/user'));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
