import dotenv from 'dotenv';
import 'dotenv/config'
import express from 'express';
import path from 'path';
import http from 'http';

import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import Stripe from 'stripe';

import router from './router';
//import './db/product';
import product from './router/product'

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const MONGO_URL = 'mongodb+srv://lboodyde02:z3waSl6id8myNoyu@cluster0.pvhkp.mongodb.net/';

//const url = process.env.URL;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' as any,
    typescript: true,
}); // Add your stripe secret key here

console.log("✅Stripe initialized successfully!")

const app = express();

app.use(cors(
    {
        origin: '*',
        credentials: true,
    }
));
app.use(compression()); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For handling form data

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/my-webhook', express.raw({ type: 'application/json' }), product);

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error) => {console.log('❌MongoDb connection error: ',error)});
mongoose.connection.on('open', () => {console.log('✅Connected to MongoDB')});

// Routes
//app.use('/auth', authentication); // Handles login/register
//app.use('/user', users); // Handles user-related routes
app.use('/', router());

// Serve static pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../public/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../public/register.html')));
app.get('/purchase', (req, res) => res.sendFile(path.join(__dirname, '../public/purchase.html')));


const server = http.createServer(app);
server.listen(8088, () => {
    console.log('🚀 Server is running on port http://localhost:8088/');
});


//mongodb+srv://lboodyde02:z3waSl6id8myNoyu@cluster0.pvhkp.mongodb.net/

//sk_test_51QxWcNFV9MoSGNBFp8a3sJgsGUaD3HTqsX3yUKQ0OrYdAx0XXGghcSiwUS8BoPqr4q3NhWOECYRMcRVHAomwpiUq00kDfAXQYE
// Set-ExecutionPolicy RemoteSigned -Scope CurrentUser