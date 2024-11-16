const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Include ObjectId for MongoDB operations
const path = require('path');

const app = express();
const port = 3000;

// MongoDB credentials
const username = encodeURIComponent("general_user");
const password = encodeURIComponent("generalUser13");
const uri = `mongodb+srv://${username}:${password}@mycluster.4q5ij.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster`;
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToDatabase() {
    await client.connect();
    console.log("Connected to MongoDB");
}

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes

// List all databases
app.get('/api/databases', async (req, res) => {
    try {
        const databasesList = await client.db().admin().listDatabases();
        res.json(databasesList.databases);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving databases");
    }
});

// Retrieve all users
app.get('/api/users', async (req, res) => {
    try {
        const db = client.db("user_data");
        const users = await db.collection("users").find({}).toArray();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving users");
    }
});

// Retrieve posts by a specific user
app.get('/api/posts/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const db = client.db("user_data");
        const posts = await db.collection("social_posts").find({ author: userId }).toArray();
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving posts");
    }
});

// Retrieve all posts for the feed
app.get('/api/feed', async (req, res) => {
    try {
        const db = client.db("user_data");
        const posts = await db.collection("social_posts").find({}).toArray();
        res.json(posts);
    } catch (err) {
        console.error('Error fetching feed data:', err);
        res.status(500).send('Error fetching feed data');
    }
});

// Increment likes for a post
app.post('/api/like', async (req, res) => {
    const { postId } = req.body;
    try {
        const db = client.db("user_data");
        const result = await db.collection("social_posts").updateOne(
            { post_id: postId },
            { $inc: { likes_count: 1 } }
        );
        res.json({ success: result.modifiedCount === 1 });
    } catch (err) {
        console.error('Error updating likes:', err);
        res.status(500).json({ success: false });
    }
});

// Add a follow for a user
app.post('/api/follow', async (req, res) => {
    const { userId, followerId } = req.body;
    try {
        const db = client.db("user_data");
        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { followers: followerId } }
        );
        res.json({ success: true, updated: result.modifiedCount });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating followers");
    }
});

// React to a post (like or dislike)
app.post('/api/react', async (req, res) => {
    const { post_id, reaction } = req.body;
    const incrementField = reaction === 'like' ? 'likes_count' : 'dislikes_count';

    try {
        const db = client.db("user_data");
        const result = await db.collection("social_posts").updateOne(
            { post_id: post_id },
            { $inc: { [incrementField]: 1 } }
        );
        res.json({ success: result.modifiedCount === 1 });
    } catch (err) {
        console.error('Error updating reaction:', err);
        res.status(500).send('Error updating reaction');
    }
});

// Start the server
app.listen(port, () => {
    connectToDatabase().catch(console.error);
    console.log(`Server running at http://localhost:${port}`);
});
