# Authentication: Stateful vs. Stateless (JWT)

## 1. Stateful Authentication
In a stateful authentication system, the server must keep track of active sessions.

### How it Works
* The browser sends a login request with a username and password to the server.
* If the credentials are correct, the server generates a unique string called a **Session ID**.
* This Session ID is sent back to the browser via the response, headers, or inside a Cookie. 
* **Cookie:** A piece of text data (key-value pair) that the server asks the browser to store. It acts as a "ticket".
* From then onwards, whenever the browser wants to make an HTTP request (e.g., view a profile), it attaches the cookie containing the Session ID.
* The server checks the Session ID against its database. If it matches, the request is fulfilled.

### Problems with Stateful Authentication
Because the server has to create and store a Session ID for every logged-in user, it becomes difficult to maintain as the site grows. 

* **Server Restarts:** If the server crashes or restarts, all stored Session IDs are wiped out, forcing all users to log in again.
* **Horizontal Scaling Issues:** When traffic increases, you introduce a Load Balancer to distribute requests across multiple servers (e.g., Server 1, Server 2, Server 3).
    * If a login request goes to Server 1, Server 1 creates and stores the Session ID.
    * If the user's next request is routed by the Load Balancer to Server 2, Server 2 won't have that Session ID and will deny the user access.
* **Complex Workarounds:** To fix scaling issues, you either have to configure the load balancer so requests from a specific address always go to the same server, or you have to connect all servers to a shared centralized Session ID database. Both approaches increase complexity and are difficult to maintain.

---

## 2. Stateless Authentication (JWT)
To solve the scaling and memory problems of stateful systems, we use stateless authentication via **JWT (JSON Web Token)**. Information is transferred between parties as a JSON object.

### How it Works
* The browser sends a login request (username, password) to the server.
* If correct, the server generates a JWT.
* This JWT is signed digitally by a cryptographic key.
* The server sends the JWT back to the browser in a cookie or a simple response.
* In future requests, the browser sends the JWT back to the server.

### JWT Format
A JWT consists of three parts separated by dots:
`header.payload.signature`

* **Header:** Specifies the cryptographic algorithm being used (e.g., HMAC-SHA256).
* **Payload:** Contains the data claims.
* **Signature:** Used to verify that the token hasn't been tampered with.

### The Verification Process
1. When the server receives the JWT, it takes the **header** and the **payload** and runs them through the cryptographic algorithm specified in the header.
2. It uses its own secret private key (or a public key if asymmetric encryption is used) to recalculate the signature. 
3. The server then compares this newly calculated signature with the signature that was attached to the JWT sent by the browser. 
4. If the signatures match, the request is accepted.

### The Stateless Advantage
Because the JWT contains everything needed for verification (and is securely signed), the server doesn't need to remember or store session states in a database. **It no longer matters which server the load balancer forwards the request to**—any server with the secret key can verify the JWT independently.