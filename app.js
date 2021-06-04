const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

// app.use('/favicon.ico', express.static('images/favicon.ico'));

app.use('/app1', express.static(path.join(__dirname, '/app1')));
app.use('/app0', express.static(path.join(__dirname, '/app0')));
app.use('/main', express.static(path.join(__dirname, '/main')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/image_cropper', (req, res) => {
    res.sendFile(path.join(__dirname, '/app0.html'));
});
app.get('/image_resizer', (req, res) => {
    res.sendFile(path.join(__dirname, '/app1.html'));
});

http.listen(process.env.PORT || 3000, () => {
    console.log(`listening on *:${process.env.PORT || 3000}`);
});
