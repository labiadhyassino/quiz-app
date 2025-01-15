const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db.config'); // Importer la fonction connect

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connexion à la base de données
let dbConn;
connectDB().then(db => {
    dbConn = db; // dbConn est maintenant un objet de base de données valide
    console.log("Database connection established.");
}).catch(err => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});

// Routes
app.get('/', function (req, res) {
    res.send("Hello world!");
});

// GET Questions
app.get('/questions/:type', async (req, res) => {
    try {
        const questions = await dbConn.collection('Quiz').find({ type: req.params.type }).toArray();
        res.send(questions);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

// POST Save Answers
app.post('/saveAnswers', async (req, res) => {
    try {
        const userAnswersCollection = dbConn.collection('User');
        const userData = req.body;

        // Insérer les réponses de l'utilisateur
        await userAnswersCollection.insertOne(userData);
        res.send("Answers saved successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});