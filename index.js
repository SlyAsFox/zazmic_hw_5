require('dotenv').config();

const mongoose = require('mongoose');
const Database = require('./database/database');

const http = require('http');
const express = require('express');
const https = require('https');
const sequelize = require('./sequelize');

const blogRoutes = require('./routes/api/v1/blog');
const usersRoutes = require('./routes/api/v1/users');

const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/users', usersRoutes);

app.get('*', (req, res) => {
    https.get(process.env.FRONTED_URL, response => response.pipe(res));
});

app.use((error, req, res, next) => {
    res.send({
        error: error.message
    });
});

const server = http.createServer(app);

sequelize.authenticate()
    .then(() => {
        server.listen(process.env.PORT || 5000);
        console.log(`Server running at PORT:${process.env.PORT || 5000}/`);
    })
    .catch(() => {
        console.log('Connection error');
    });
