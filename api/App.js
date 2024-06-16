import express from 'express';
import Authroute from './Routes/Authroute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Testroute from "./Routes/Testroute.js";
import Userroute from "./Routes/Userroute.js"
import Postroute from "./Routes/Postroute.js"

// Create an instance of an Express application
const app = express();

// Configure CORS to allow requests from the specified origin and include credentials
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Debugging log to ensure the script reaches this point
console.log("tedhjjt1");

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse cookies attached to client requests
app.use(cookieParser());

// Route all requests starting with /api to the Authroute module
app.use('/api', Authroute);
app.use('/api', Testroute);
app.use('/api/user', Userroute);
app.use('/api/post', Postroute)

// Simple route to verify the server is working
app.use('/alok', (req, res) => {
    res.send('working');
});

// Start the server on port 5000 and log a message to the console
app.listen(5000, () => {
    console.log('server running');
});
