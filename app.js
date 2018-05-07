const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/project9');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected');
    let userSchema = mongoose.Schema({
        userID: String,
        name: String,
        age: Number,
        email: String
    });

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

app.listen(27017, () => {
    console.log(`listening on port 27017`);
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