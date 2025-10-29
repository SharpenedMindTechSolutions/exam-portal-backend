const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const UserRoutes = require('./Router/userrouter');
const ExamRoutes = require('./Router/examrouter');
const AdminRouter = require('./Router/adminrouter')

dotenv.config();
connectDB();

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running  exam  portal project");
});

app.use('/api/auth', UserRoutes);
app.use('/api/exam', ExamRoutes);
app.use('/api/admin',AdminRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

