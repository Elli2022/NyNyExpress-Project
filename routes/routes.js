const express = require('express');
const router = express.Router();
const connection = require('../db_connection');

router.get('/', (req, res) => {
    const data = {
        title: "Welcome",
        style: "color: red;"
    }
    res.render('index', data)
})

router.get('/test', (req, res) => {
   
    res.send('test');
})

router.get('/logged-in', (req, res) => {
    if (req.session.authenticated && req.session.username) {
        // If the user is authenticated
        const username = req.session.username;
        const data = {
            name: username,
            style: "color: red;"
        }
        res.render('logged-in', data)
    } else {
        res.redirect('/login');
    }
})

router.get('/logout', (req, res) => {
    if (req.session.authenticated && req.session.username) {
        req.session.authenticated = false;
        req.session.ausername = null;
        res.redirect('/')
    } else {
        res.redirect('/login');
    }
})

router.get('/login', (req, res) => {
    res.send('login')
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    connection.query(`SELECT * FROM users WHERE email='${email}' AND password='${password}'`, function (error, results, fields) {
        if (error) throw error;

        if(results.length > 0){
            console.log(results[0].name)
            // res.send('Found ' + results.length + ' users')
            req.session.username = results[0].name;
            req.session.authenticated = true;
            res.redirect('/logged-in');
        }else{
            res.send('Found no users')
        }

    });

})


// SIGN UP
router.get('/signup', (req, res) => {
    res.render('signup')
})

// Route for creating a new user
router.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    const user = { name, email, password };

    // Insert new user into MySQL database
    connection.query('INSERT INTO users SET ?', user, (err, results) => {
        if (err) {
            console.error('Error creating new user: ', err);
            res.status(500).send('Error creating new user');
            return;
        }
        console.log('New user created with id: ', results.insertId);
        req.session.username = user.name;
        req.session.authenticated = true;
        res.redirect('/logged-in');
    });
});

module.exports = router;