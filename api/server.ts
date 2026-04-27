import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send('Okay!!');
})

app.get("/health", (req, res) => {
    res.status(200).send('Server healthy!');
})

app.listen(3000, () => {
    console.log('app listening on port 3000...');
})