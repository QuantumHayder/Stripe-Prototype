import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },   
    email: {type:String, required: true},
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, selected: false },
        sessionToken: { type: String, selected: false },
    },
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken : String) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
export const updateUser = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
export const deleteUserById = (id:string) => UserModel.findOneAndDelete({_id: id});