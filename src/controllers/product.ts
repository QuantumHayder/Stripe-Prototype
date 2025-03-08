import express from 'express';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID as string;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;


const stripe = new Stripe(STRIPE_SECRET_KEY,{
    apiVersion: '2023-10-16' as any,
    typescript: true, 
}); 

export const createProductSession: express.RequestHandler = async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                   price: STRIPE_PRICE_ID,
                   quantity: 1
                },
            ],
            mode: 'payment',
            success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.URL}/cancel`,
        });
        console.log("Session created Successfully!", session);
        return res.redirect(303, session.url);
    } catch(error){
        console.log('Error generating session',error);
        res.sendStatus(400);
    }
};

export const createWebhook: express.RequestHandler = async (req,res) =>{
    try{
        const sig = req.headers['stripe-signature'] as string;
        const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
        if(event.type === 'checkout.session.completed'){
            console.log('✅Payment was successful!', event);
        } else {
            console.log('❔❓Unhandled event ', event.type);
        }
        res.sendStatus(200);
    } catch(error){
        console.log('Error generating session',error);
        res.sendStatus(400);
    }
};

export const successRoute: express.RequestHandler = async (req, res) => {
    try{
        console.log('✅success route!', req.query.session_id);
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string);
        console.log("session retrieved", session);
        res.send(`
            <html>
                <body>
                    <h1>Thanks for your order, ${session.customer_details?.name || 'Customer'}!</h1>
                </body>
            </html>
        `);
    } catch(error){
        console.log('Error handling success',error);
        res.sendStatus(400);
    }
}

export const cancel: express.RequestHandler = async (req, res) => {
   res.send(`
        <html>
        Cancelled
        </html>
    `);
}
