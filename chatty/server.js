/**
 * Name: server.js
 * Author: Billy Dolny
 * Class: CSC337
 * Purpose: This program should read a url that is able to contain 
 * messages with multiple people. Like a messenger system.
 */
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 5000;
let mesCount = 0;

// ACTIVATING MONGOOSE
const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/chats';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// MESSAGE SCHEMA
var ChatMessageSchema = new mongoose.Schema({
  time: Number,
  alias: String,
  message: String
});
var ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema );

/**
 * This function is used to save a message from the client and send it to the
 * database.
 * alias: name of user
 * words: message from user
 * res; to end server.
 */
function saveMessage(alias, words, res) {
    mesCount++;
    let newChatMessage = new ChatMessage({ time: mesCount, alias: alias, message: words });
    newChatMessage.save()
        .then(() => {
            console.log(newChatMessage); // You can log the saved message here
            fullMessages(res);
        })
        .catch((error) => {
            console.error("Error saving message:", error);
            res.status(500).end("Error saving message.");
        });
}
/**
 * This function is used to look at ever message that was 
 * sent by multiple users and adds it to one.
 *
 */
function fullMessages(res){
    let query = ChatMessage.find({})
    query.then((documents) => {
        let results = "";
        
        for (let i = 0; i < documents.length; i++) {
            node = documents[i];
            results = results + `${node.alias}: ${node.message}\n`;
        }
        res.end(results);
    });
}

app.use(express.static('public_html'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // This allows requests from any origin, which is not recommended for production.
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Just to get all the messages
app.get('/chats/', (req, res) => {
    fullMessages(res);
});

// To send a message to the database
app.get('/chats/post/:name/:message/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    let nameURL = req.params.name;
    console.log(nameURL);
    let words = req.params.message;
    console.log(words);
    nameURL = nameURL.split('+');
    alias = "";
     for (var i = 0; i < nameURL.length; i++){
        alias = alias + nameURL[i];
        console.log(alias)
    }
   
    words = words.split('+');
    message = "";
    for (var i = 0; i < words.length; i++){
        message = message + " "+ words[i];
        console.log(message)
    }
    message = message.substring(1);


    saveMessage(alias, message, res);
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});