import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); // wide open...
app.use(express.json());

app.get("/", (req, res) => {
    res.json({});
})

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server healthy!" });
})

app.get("/last-updated", (req, res) => {
    res.status(200).send({ time: 'April 26th, 2026 at 12:52 AM' });
})

app.listen(3000, () => {
    console.log('app listening on port 3000...');
})