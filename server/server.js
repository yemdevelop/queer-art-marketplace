require('dotenv').config();

const mongoose = require('mongoose');

const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})