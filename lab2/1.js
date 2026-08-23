import crypto from 'crypto'

//Older Node.js APIs (including many functions in the crypto and fs modules) were built before 
//Promises and async/await existed. They relied on callbacks

crypto.scrypt('myPassword', 'mySalt', 64, (err, derivedKey)=>{
//myPassword -> plain text password user enters

//mySalt -> salt is random data added to the password before hashing. This ensures that even if 
//two users have the password "myPassword", their final hashes will look completely different.

//64 -> The key length. We are asking the algorithm to output a hash that is exactly 64 bytes long.

    if(err){
        console.log(`Error: ${err}`)
        return
    }

    console.log(`Successfully hashed: ${derivedKey.toString('hex')}`)
    //derivedKey is returned as a Buffer (raw binary data, like 01010100)
    //translated binary to hexadecimal string (0-9, a-f)
})