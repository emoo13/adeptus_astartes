const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

var username = encodeURIComponent("jmckenna49");
var password = encodeURIComponent("Gruelingshadow49!!");

var uri = `mongodb+srv://${username}:${password}@mycluster.4q5ij.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster`;

const app = express();
const port = 3000;
let db;

app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(uri)
    .then(client => {
        db = client.db("user_data");
        console.log("Connected to MongoDB");
    })
    .catch(error => console.error("Error connecting to MongoDB:", error));

// Serve static files (JavaScript, CSS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define the route to increment likes
app.put('/api/posts/:id/like', async (req, res) => {
    const postId = parseInt(req.params.id);  // Ensure postId is always treated as a number

    console.log(`Received request to update likes for post with id: ${postId}`);

    try {
        const collection = db.collection("social_posts");

        // Query with postId as a number
        const result = await collection.findOneAndUpdate(
            { post_id: postId },
            { $inc: { likes_count: 1 } },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            console.error(`Post with id ${postId} not found in the database.`);
            res.status(404).send("Post not found");
            return;
        }

        console.log(`Successfully updated post with id ${postId}, new likes count: ${result.value.likes_count}`);
        res.json({ likes_count: result.value.likes_count });
    } catch (error) {
        console.error("Error occurred during database update:", error);
        res.status(500).send("Internal server error");
    }
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

