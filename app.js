const express = require("express");
const app = express();
const port = 3000;
const session = require('express-session');
var mysql = require("mysql");

app.use(express.static("public"));

//För postman
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set EJS as the view engine
app.set('view engine', 'ejs');

//Specify the location of the views folder
app.set('views', './views');

app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
  })
);

//Database connection
var connection = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "admin",
  password: "password",
  database:'express_demo'
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});



//Letar efter statiska filer i public mappen
app.use(express.static("public"));

//Default port 3000
app.get("/", (req, res) => {
  const data = {
    title:"Welcome",
    style: "color:green",
  }
  res.render("index", data);
  // res.sendFile("Hello World! TEST TEST");
});

app.get("/api/getuser", (req, res) => {
  res.json('{"name": "Elli"}');
});

app.get("/logged-in", (req, res) => {
  if(req.session.authenticated){
    //if the user is authenticated
    const data = {
      name: "Elli",
      style: "color: red"
    }
    //if the user is authenticated, render the dashboard
    res.render("logged-in", data);
  }else{
    res.redirect("/login");
  }
});

//Skapar en route till INDEX.HTML
app.get("/random", (req, res) => {
  res.sendFile(__dirname + "/views/html/index.html");
});

//Lyssnar
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/logged-in", (req, res) => {
  res.sendFile('Logged In...');
});

app.get("/login", (req, res) => {
  res.render('login');
});

//Post
app.post("/login", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  // console.log(email);
  // console.log(password);

  connection.query(`SELECT * FROM users WHERE email = '${email}' AND password = '${password}' ` , function (error, results, fields) {
    if (error) throw error;

    if(results.length > 0){
      // res.send('Found' + results.length + 'users');
      req.session.authenticated = true;
      res.redirect(`/logged-in`);
    }
    else{
      res.send('Found no users');
    }
    console.log(results);
  });
})

//GET (ROUTE TILL LOGIN.HTML)
app.get("/login", (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + "/views/html/login.html");
});
