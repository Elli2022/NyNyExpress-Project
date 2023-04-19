const express = require('express')
const app = express()
const port = 3000
const session = require('express-session');
var mysql  = require('mysql');

app.use(express.static('public'));

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the location of the views folder
app.set('views', './views');


app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: true
    })
);

// Database connection
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'root',
  database : 'express_demo'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});


app.get('/', (req, res) => {
    const data = {
        title: "Welcome",
        style: "color: red;"
    }
    res.render('index', data)
    // res.sendFile(__dirname + '/views/html/index.html');
})

app.get('/api/getfavoritecolor', (req, res) => {
    if (req.session.authenticated && req.session.username) {

        connection.query(`SELECT * FROM users WHERE name='${req.session.username}'`, function (error, results, fields) {
            if (error) throw error;

            if(results.length > 0){
                res.json(`{"color": ${results[0].favorite_color}}`);
            }else{
                // res.send('Found no users')
            }

        });

    }else {
        res.redirect('/login');
    }
})


app.get('/logged-in', (req, res) => {
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

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
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
app.get('/signup', (req, res) => {
    res.render('signup')
})

// Route for creating a new user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  console.log('User object:', user); // Add this line to print the user object

  // Insert new user into MySQL database
  connection.query('INSERT INTO users SET ?', user, (err, results) => {
      if (err) {
          console.error('Error creating new user:', err); // Make sure this line is present
          if (err.code === 'ER_DUP_ENTRY') {
              res.status(400).send('Email already exists');
          } else {
              res.status(500).send('Error creating new user');
          }
          return;
      }
      console.log('New user created with id:', results.insertId);
      req.session.username = user.name;
      req.session.authenticated = true;
      res.redirect('/logged-in');
  });
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})