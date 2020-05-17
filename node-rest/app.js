const express = require('express');
const http = require('http');

const click = require('./routes/click');

const app = express();

const port = parseInt(process.env.PORT || '3000');

app.get('/', (req, res) => {
    return res
        .status(200)
        .json({ server: 'node-rest', timestamp: new Date() });
});

// Routes
app.use('/click', click);

const server = http.createServer(app);
server.listen(port);

server.on('listening', () => {
    console.log('node-rest is listening on port:', port);
});

server.on('error', (error) => {
    console.log('node-rest on error', error);
});