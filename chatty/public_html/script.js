/*
Name: Billy Dolny
class: CSC 337
file: script.js
assignment: Translator part 2
Description: This file is used as the script that works with the 
index.html where when the user uses the textarea boxes it will go to the 
server and change the letters to a translation of the other box.
*/

/**
 * This function is used to get every message sent by all users
 * and make it print on the screen ever 1 second.
 */
function getting() {
    let mssgBoard = document.getElementById("messages");
    let url = 'http://127.0.0.1:5000/chats';
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            mssgBoard.innerText = text;
        })
        .catch((error) => {
            console.log("There was a problem with getting messages");
            console.log(error);
        });
}

// Call the getting function every second (1000 milliseconds)
const intervalId = setInterval(getting, 1000);

/**
 * This function is used when it the user hits the
 * send message buttom which then sends their message 
 * to the server to be stored in the database.
 */
function sending(){
    let mssgInput = document.getElementById("mssg");
    let aliasInput = document.getElementById("alias").value;
    let mssgBoard = document.getElementById("messages");
    mssgInput = mssgInput.value.split(" ");
    mssg = "";
    for (var i = 0; i < mssgInput.length; i++){
        mssg = mssg + "+" + mssgInput[i];
    }
    mssg = mssg.substring(1);
    aliasInput = aliasInput.split(" ");
    alias = "";
    for (var i = 0; i < aliasInput.length; i++){
        alias = alias + "+" + aliasInput[i];
    }
    alias = alias.substring(1);
    let url = 'http://127.0.0.1:5000/chats/post/' + alias + '/' + mssg + '/';
    fetch(url).then((response) => {
        return response.text();
    }).then ((text) => {
        mssgBoard.innerText = text;
    }).catch((error) => {
        console.log("THERE WAS A PROB WITH SENDING");
        console.log(error);
    });
}