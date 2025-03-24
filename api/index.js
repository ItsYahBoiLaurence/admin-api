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
    const { email, password } = req.body;
    const user = await admin.auth().createUser({
        email,
        password
    });
    await admin.auth().setCustomUserClaims(user.uid, {
        role: 'employee',
        companyId: 'Mayan Solutions'
    });
    res.json({ message: 'User registered successfully', user });
});

// Example API route
app.get('/api', (req, res) => {
    res.json({ message: "Message from the API!" });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});