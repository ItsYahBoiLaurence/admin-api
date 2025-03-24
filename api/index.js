import 'dotenv/config'
import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors'; // Importing cors

const app = express();
const port = 3000;

app.use(cors()); // Allowing all origins, methods, and headers

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enabling CORS for all origins

// Home route
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.post('/api/registerUser', async (req, res) => {
    try {
        const { company, role, uid } = req.body;
        await admin.auth().setCustomUserClaims(uid, {
            role: role,
            company: company
        }).then(() => {
            console.log('User registered successfully');
        }).catch((error) => {
            console.error('Error registering user:', error);
        });
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error' });
    }
});


app.get('/api/user/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        res.json(userRecord);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});


app.get('/api/user/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userRecord = await admin.auth().getUser(uid);
        res.json(userRecord);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});



// Example API route
app.get('/api', (req, res) => {
    res.json({ message: "Message from the API!" });
});

// Start server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

export default app
