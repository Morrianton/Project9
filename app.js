const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const app = express();

let port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let file = 'users.json';
let newUser = {};
let users;
let obj;
let json;

let id = 1;

app.get('/', (req, res) => {
    res.render('index');
});

// Adds new user to users table via POST request
app.post('/users', (req, res) => {

    fs.readFile(file, 'utf8', (err, data) => {
       if (err) throw err;

       obj = JSON.parse(data);

       if(obj.users === null) {

           newUser = {
               id: id,
               userID: req.body.userID,
               name: req.body.name,
               age: req.body.age,
               email: req.body.email
           };

       }
       else {
           obj.users.forEach((user) => {
               if(id === user.id) {
                   id++;
               }
           });

           newUser = {
               id: id,
               userID: req.body.userID,
               name: req.body.name,
               age: req.body.age,
               email: req.body.email
           };

           id = 1;

       }

           obj.users.push(newUser);
           json = JSON.stringify(obj);
           fs.writeFileSync(file, json, 'utf8');

           console.log(`${req.body.userID} was added to ${file}`);

        res.render('users', {users: obj.users});

    });

});

app.get('/users', (req, res) => {

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;

        obj = JSON.parse(data);

        res.render('users', {users: obj.users});

    });

});

app.get('/edit-user/:id', (req, res) => {

    fs.readFile(file, 'utf8', (err, data) => {

        obj = JSON.parse(data);

        let userIndex = findUserIndex(req.params.id, obj.users);

        res.render('edit', {user: obj.users[userIndex]});
    });
});

app.post('/edit-user/:id', (req, res) => {

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;

        obj = JSON.parse(data);

        newUser = {
            id: req.params.id,
            userID: req.body.userID,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        };

        let userIndex = findUserIndex(req.params.id, obj.users);

        obj.users.splice((userIndex), 1, newUser);

        json = JSON.stringify(obj);

        fs.writeFileSync(file, json, 'utf8');
    });

    res.redirect('/users');
});


app.get('/delete/:id', (req, res) => {

    fs.readFile(file, 'utf8', (err, data) => {
       if (err) throw err;

       obj = JSON.parse(data);

       let userIndex = findUserIndex(req.params.id, obj.users);

       obj.users.splice((userIndex), 1);

       json = JSON.stringify(obj);

       fs.writeFileSync(file, json, 'utf8');

   });

    res.redirect('/users');

});

app.get('/delete', (req, res) => {

    res.redirect('/users');

});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

// finds a user's index by their id and returns it
function findUserIndex(id, array) {
    let index = 0;

    for(let i = 0; i <= array.length - 1; i++) {
        if(id == array[i].id) {
            index = i;
        }
    }

    return index;

}