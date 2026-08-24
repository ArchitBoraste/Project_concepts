import crypto from 'crypto'
import util from 'util'

const scrypt = util.promisify(crypto.scrypt)

export function generateSecret(){
    //returns random 64 bytes of cryptographically secure, unpredictable random data (hex converts
    //the raw binary buffer into hex (0-9, a-f) string)
    return crypto.randomBytes(64).toString('hex')

}

export function hashPassword(password){
    const salt = crypto.randomBytes(16).toString('hex')
    const derivedKey = crypto.scrypt(password, salt, 64)

    //storing hashed password and salt together seperated by colon
    //becausse when verifying password later we will need to use same salt
    return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password, storedHash){
    const [salt, key] = storedHash.split(':')
    const keyBuffer = Buffer.from(key, 'hex')

    
}