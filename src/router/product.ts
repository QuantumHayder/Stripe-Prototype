import express from 'express';

import { createProductSession, createWebhook, successRoute, cancel} from '../controllers/product';
import { isAuthenticated } from '../middleware/authFunctions';


const router = express.Router();

export default (router: express.Router) => {
    router.post('/session' ,createProductSession);
    router.post('/my-webhook', createWebhook);
    router.get('/success', successRoute);
    router.get('/cancel', cancel);
}

