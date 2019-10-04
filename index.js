const http = require('http');
const express = require('express');
const https = require('https');

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

server.listen(process.env.PORT);
console.log(`Server running at http://127.0.0.1:${process.env.PORT}/`);