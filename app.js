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

let user;

let port = 27017;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Mongo Database Connected');
    let userSchema = mongoose.Schema({
        userID: String,
        name: String,
        age: Number,
        email: String
    });

    user = mongoose.model('user', userSchema);

    app.get('/', (req, res) => {
        res.render('index');
    });

// Adds new user to users table via POST request
    app.post('/users', (req, res) => {
        let newUser = new user(
            {
                userID: req.body.userID,
                name: req.body.name,
                age: req.body.age,
                email: req.body.email
            }
        );

        newUser.save((err, newUser) => {
            if (err) throw err;

            console.log(`${newUser.userID} Added to the Database`);

            user.find({}, (err, users) => {
                if (err) throw err;

                res.render('users', {users: users});
            });

        });

    });

    app.get('/users', (req, res) => {

        user.find({}, (err, users) => {
            if(err) throw err;

            res.render('users', {users: users});
        })

    });

    app.get('/edit-user/:_id', (req, res) => {

        user.findById(req.params._id, (err, user) => {
           if (err) throw err;

           res.render('edit', {user: user})
        });

    });

    app.post('/edit-user/:_id', (req, res) => {

        user.update({_id: req.params._id},
            {$set:
                    {
                        userID: req.body.userID,
                        name: req.body.name,
                        age: req.body.age,
                        email: req.body.email
                    }
            },
            (err) => {
            if (err) throw err;

            Console.log(`${user.userID} Has Been Updated`);

            res.redirect('/users');
        });

    });

    app.get('/delete/:_id', (req, res) => {

        user.remove({_id: req.params._id}, (err) => {
            if (err) throw err;

            console.log('User Removed from the Database')

            res.redirect('/users');
        });

    });

    app.listen(port, (err) => {
        if (err) throw err;

        console.log(`Listening on Port: ${port}`);
    });

});