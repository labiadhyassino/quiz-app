const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; // MongoDB connection string
const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('quizdb'); // Sélection de la base de données

        // Vérifier si la collection 'User' existe, sinon la créer
        const userCollections = await db.listCollections({ name: 'User' }).toArray();
        if (userCollections.length === 0) {
            await db.createCollection('User');
            console.log("Collection 'User' created.");
        }

        // Vérifier si la collection 'Quiz' existe, sinon la créer et insérer des questions
        const quizCollections = await db.listCollections({ name: 'Quiz' }).toArray();
        if (quizCollections.length === 0) {
            await db.createCollection('Quiz');

            // Insérer deux questions dans la collection 'Quiz'
            const quizCollection = db.collection('Quiz');
            await quizCollection.insertMany([
                {
                    type: "math",
                    question: "What is 2 + 2?",
                    options: ["3", "4", "5", "6"],
                    correctAnswer: "4",
                    category: "Beginner"
                },
                {
                    type: "science",
                    question: "What is the chemical symbol for water?",
                    options: ["H2O", "CO2", "NaCl", "O2"],
                    correctAnswer: "H2O",
                    category: "Intermediate"
                }
            ]);

            console.log("Collection 'Quiz' created and initialized with 2 questions.");
        }

        return db; // Retourne l'objet de base de données
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

// Exporter une fonction qui retourne la promesse
module.exports = connect;