const express = require('express');
const endpoints = express.Router();
const connection = require('./../db_connection');


endpoints.get('/api/getfavoritecolor', (req, res) => {
    if (req.session.authenticated && req.session.username) {

        connection.query(`SELECT * FROM users WHERE name='${req.session.username}'`, function (error, results, fields) {
            if (error) throw error;

            if(results.length > 0){
                const data = {"color": results[0].favorite_color}
                res.json(data);
            }else{
                // res.send('Found no users')
            }

        });

    }else {
        res.redirect('/login');
    }
})

module.exports = endpoints;