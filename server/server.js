const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})