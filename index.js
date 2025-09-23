const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const crypto = require('crypto');
const { connect } = require('http2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/userRoutes');

// API credentials (best to keep in env vars)
const API_KEY = process.env.LK_API_KEY || "APIFCg8ySkqfnH9";
const API_SECRET = process.env.LK_API_SECRET || "v2RcC7z9Rl23RTdZVzdXJTnfAnJBnMesyoXF6il7ecbB";

// helper to generate short random strings
function randomString(len = 6) {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('base64url').slice(0, len);
}

// GET /token?room=roomName&identity=userId
app.get('/token', async (req, res) => {
    try {
        // generate randomized room & identity if not passed in
        const room = req.query.room || `room-${randomString(6)}`;
        const identity = req.query.identity || `identity-${randomString(4)}`;

        const at = new AccessToken(API_KEY, API_SECRET, { identity });
        at.addGrant({
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
            room
        });

        const token = await at.toJwt();

        res.json({ token, roomName: room, identity });
    } catch (err) {
        console.error('failed to create token', err);
        res.status(500).json({ error: 'failed to create token' });
    }
});

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'LiveKit token server with User Management API',
        endpoints: {
            livekit: 'GET /token?room=<room>&identity=<id>',
            users: {
                getAll: 'GET /api/users',
                getById: 'GET /api/users/:id',
                create: 'POST /api/users',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id',
                search: 'GET /api/users/search?q=<query>',
                stats: 'GET /api/users/stats'
            }
        }
    });
});



mongoose.connect("mongodb+srv://rajagururtrs_db_user:TE9cwwhWwaNL0OMU@cluster0.pqfqdzn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to database");
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }).catch((err) => {
        console.log("Error connecting to database", err);
    });


