import crypto from 'crypto';

const SECRET = 'BOODY-REST-API';

//implicit return, When an arrow function has only one expression, 
// it implicitly returns the result of that expression
//equivalent to:
/*export const random = () => { 
    return crypto.randomBytes(128).toString('base64'); 
};
*/
export const random = () => crypto.randomBytes(128).toString('base64');

//explicit return, preferred when the function has multiple expressions
export const authentication = (salt: string, password: string) =>{
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};
//The salt is combined with the password using join('/').
//The resulting string is then hashed using HMAC-SHA256 with a secret key (SECRET).
//This ensures that even if two users have the same password, 
// their hashed values will be unique due to different salts.
//Prevents Precomputed Attacks (Rainbow Tables)
//Attackers use large precomputed tables of hashed passwords to crack weak passwords.
