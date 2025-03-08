import express from 'express';
import { getUserByEmail, createUser } from '../db/user';
import { random, authentication } from '../helpers/authentication';

export const login: express.RequestHandler = async (req, res): Promise<void> => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            res.sendStatus(400);   //invalid request
            console.log("Request Body:", req.body);
            return;
        }
        const existingUser = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!existingUser){
            res.sendStatus(404);  //not found
            return;
        }

        const expectedhash = authentication(existingUser.authentication.salt, password);

        if(existingUser.authentication.password !== expectedhash){
            res.sendStatus(403); //forbidden, authentication failed
            return;
        }

        const salt = random();
        existingUser.authentication.sessionToken = authentication(salt, existingUser._id.toString());
        
        await existingUser.save();

        res.cookie('HAYDER-AUTH', existingUser.authentication.sessionToken, {domain: 'localhost', path: '/'});
        //res.status(200).json(existingUser).end();
        console.log("✅ User Logged In:", existingUser.email);
        res.redirect(303,'/purchase');
    } catch(error) {
        console.log("failed",error);
        res.sendStatus(400);
    }
}

export const register: express.RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.sendStatus(400);
            console.log("Request Body:", req.body);
            return;
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            res.sendStatus(409); // The HTTP 409 Conflict response status code indicates a request conflict with the current state of the target resource.
            return;
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        //res.status(201).json(user).end(); // 200 is ok, 201 is created
        console.log("✅ New User Registered:", { username, email });
        res.redirect(303,'/purchase');
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};