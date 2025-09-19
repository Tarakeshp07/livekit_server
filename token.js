/*
 Simple LiveKit token server

 Usage:
  - Set env vars LK_API_KEY and LK_API_SECRET to override built-in keys.
  - Start: node token.js (or npm start)
  - Request a token: GET /token?room=roomName&identity=userId

 Response: { token: "<jwt>" }
*/

const express = require('express');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
const port = process.env.PORT || 3000;

// Read API key/secret from environment with fallback to the values in the original file
const API_KEY = process.env.LK_API_KEY || "APIFCg8ySkqfnH9";
const API_SECRET = process.env.LK_API_SECRET || "v2RcC7z9Rl23RTdZVzdXJTnfAnJBnMesyoXF6il7ecbB";

// GET /token?room=roomName&identity=userId
app.get('/token', async (req, res) => {
    try {
        const room = req.query.room || 'test-room';
        const identity = req.query.identity || 'test-user';

        const at = new AccessToken(API_KEY, API_SECRET, { identity });
        at.addGrant({ roomJoin: true, room });

        const token = await at.toJwt();

        res.json({ token });
    } catch (err) {
        console.error('failed to create token', err);
        res.status(500).json({ error: 'failed to create token' });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'LiveKit token server. GET /token?room=<room>&identity=<id>' });
});

app.listen(port, () => {
    console.log(`token server listening on http://localhost:${port}`);
});

// Export app for testing if needed
module.exports = app;
