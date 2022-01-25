const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config()

const app = express();

// Routes
const indexroute = require('./routes/index')
const contributor_route = require('./routes/contributors')

app.set('view engines', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.json());

let name = process.env.DB_NAME;
let pass = process.env.DB_PASS;

// Connecting to MongoDB
const dbURI = `mongodb+srv://Tijan:${pass}@getting-started-with-no.sdrkl.mongodb.net/${name}?retryWrites=true&w=majority`
mongoose.connect(dbURI)
    .then((result)=>{
        app.listen(process.env.PORT || 3000);
    })
    .catch((err)=>{
        console.log(err);
    });

// Using Routes
app.use(indexroute);
app.use('/contributors', contributor_route);