import express from 'express'
import jwt from 'jsonwebtoken'
import { hashPassword, verifyPassword, generateSecret } from './utils.js';

const app = express()
app.use(express.json())

const usersDB = []

//creating and verifying the signature (3rd part of jwt -> header.payload.secret)
const JWT_SECRET = generateSecret()

app.post('/register', async (req, res)=>{
    const {username, password} = req.body

    if(usersDB.find((u)=>{return u.username===username})){
        return res.status(400).json({error:"User already exists"})
    }

    const hashedPassword = await hashPassword(password)
    const newUser = {id : Date.now() , username, password: hashedPassword}
    usersDB.push(newUser)
    
    res.status(201).json({message:"User added successfully"})
})

app.post('/login', async (req, res)=>{
    const {username, password} = req.body
    const user = usersDB.find((u)=>{
        return u.username === username
    })
    if(!user){
        return res.status(401).json({error:"Invalid Credentials"})
    }

    const isMatch = await verifyPassword(password, user.password)

    if(!isMatch){
        return res.status(401).json({error:"Invalid Credentials"})
    }

    //payload has no sensitive information
    const payload = {userId:user.id , username:user.username}

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'})
    //say when user alice logs into the site the server hands them a token as:
    //{username: "Alice" , role:"user"} --> this is also called as the payload

    //because JWT is encoded text (not encrypted) Alice can easily decode her token and change her role-->
    //{username: "Alice" , role:"admin"}

    //to prevent this server creates a Signature. It does this by taking three things:
    //The encoded Header, The encoded Payload, The JWT Secret (which only the server knows)
    //and throws them into into a hashing algorithm (like HMAC SHA-256). This gives a signature

    //now next time when alice tries to send a request to the server, the server takes the jwt token, strips 
    //the signature....takes the hearder and payload and JWT_SECRET (which it already has), puts then in hashing algo
    //and compares the result with signature. If results matching alices request accepted else rejected 
    res.json({ message: 'Login successful', token })
})


//middleware to check if the request ahs valid jwt token or not
function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization']
    //req coming frontend to our server server has a header
    
    //that header is full of key value pairs and looks something like this:
    //GET /protected-route HTTP/1.1
    //Host: api.yourwebsite.com
    //Accept: application/json
    //Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywidXNlcm5hbWUiOiJhbGljZSIsImlhdCI6MTY5MjI0NzIwMCwiZXhwIjoxNjkyMjUwODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

    // So in header->Authorisation key has the jwt => Bearer header.payload.signature
    //node js converts incomin header names to lower case hance we write 'authorization'
    //Bearer means give access to whoever bears this token


    const token = authHeader && authHeader.split(' ')[1]
    //first we check if authHeader exists hence 'authHeader &&'. If we directly tried to split and there was no authHeader (undefined)
    //there would be an error that crash the server (Type error)

    //authHeader looks like => Bearer actual_token(header.payload.signature)
    //so we split (with ' ') and get an array => ["Bearer", "actual_token"]
    //then we take element at index 1 (authHeader.split(' ')[1]) ie the actual token


    if(!token){
        return res.status(401).json({error : "No token provided"})
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser)=>{
        if(err){
            return res.status(403).json({error:"Invalid or expired token"})
        }
        req.user=decodedUser
        next()
    })
    //this verifies the token, by taking header, payload and JWT_SECRET and putting them in hashing algo (like hmac sha-256) and comparing
    //with signature
    //also checks if the toke has expired or not
}


app.get('/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: `Welcome, ${req.user.username}! This is protected data.`,
    userContext: req.user 
  })
})


app.listen(3005, () => console.log('Server running on http://localhost:3005'))