const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const connection = require("./db_connection");

const moment = require("moment");
app.locals.moment = moment;

require("dotenv").config();

app.use(express.static("public"));

let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Specify the location of the views folder
app.set("views", "./views");

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Database connection

//ROUTING
const router = require("./routes/routes.js");
app.use(router);

// Controllers
const posts = require('./controllers/posts')
app.use(posts);

//API Endpoints
const api = require('./api/endpoints.js')
app.use(api)



app.get("/api/getfavoritecolor", (req, res) => {
  if (req.session.authenticated && req.session.username) {
    connection.query(
      `SELECT * FROM users WHERE name='${req.session.username}'`,
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
          res.json(`{"color": ${results[0].favorite_color}}`);
        } else {
          // res.send('Found no users')
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


