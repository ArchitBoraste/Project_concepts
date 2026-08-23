import crypto from 'crypto'
import util from 'util'

const scryptAsync = util.promisify(crypto.scrypt)
//util.promisify takes an old callback-based function and transforms it into a modern function 
//that returns a Promise.

//Because it now returns a Promise, we can use the clean, modern async/await syntax instead of 
//nesting callbacks.

async function hashMyPassword(password){
    try{
        const derivedKey = await scryptAsync(password, 'mySalt', 64)
        console.log(`the hashed password is; ${derivedKey.toString('hex')}`)
    }
    catch(err){
        console.error(`Error: ${err}`)
    }
}

hashMyPassword('myPassword')