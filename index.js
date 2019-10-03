const http = require('http');
const express = require('express');

const blogRoutes = require('./routes/api/v1/blog');
const usersRoutes = require('./routes/api/v1/users');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/users', usersRoutes);




const server = http.createServer(app);

server.listen(5000);
console.log('Server running at http://127.0.0.1:5000/');