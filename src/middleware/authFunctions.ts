import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/user';

export const isOwner: express.RequestHandler = async (req, res, next) => {
    try{

        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            res.sendStatus(403);
            return;
        }

        if(currentUserId.toString() !== id){
            res.sendStatus(403);
            return;
        }
        next();
    }catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}

//export const login: express.RequestHandler = async (req, res): Promise<void> => {
export const isAuthenticated: express.RequestHandler = async (req, res, next) => {
    try{
        const sessionToken = req.cookies['HAYDER-AUTH'];

        if(!sessionToken){
            res.sendStatus(403);
            return;
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
             res.sendStatus(403);
             return;
        }
        merge(req, { identity: existingUser }); 
        next();
    }catch(error){
        console.log(error);
         res.sendStatus(400)
    }
}

/* Not all endpoints should be accessible to everyone. 
Some routes should only be available to authenticated users.

🔹 Example:

A user should not be able to access /users 
unless they are logged in.
An unauthenticated request should be blocked with a 403 Forbidden. */