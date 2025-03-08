import express from 'express';

import { getUsers, deleteUserById, getUserById } from '../db/user';
//import { get } from 'lodash';

export const getAllUsers: express.RequestHandler = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users); // No `return` needed
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

export const deleteUser: express.RequestHandler = async (req, res) => {
    try{
        const existingUser = await deleteUserById(req.params.id);
        res.json(existingUser);

    }catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}

export const updateUser: express.RequestHandler = async (req, res) => {
    try{
        const { id } = req.params;
        const { username } = req.body;

        if(!username){
            res.sendStatus(400);
            return;
        }

        const user = await getUserById(id);

        user.username = username;
        await user.save();

        res.status(200).json(user).end();

    }catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}