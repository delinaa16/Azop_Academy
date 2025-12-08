require('dotenv').config //config .config() → runs the function that reads your .env file and puts the variables into process.env
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express();
connectDB();

//Middlewares
app.use(cors());
app.use(express.json());
