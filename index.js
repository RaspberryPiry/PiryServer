var express = require('express');
var app = express();
var port = 36000;

app.use(express.json());

app.use('/user', require('./routes/user'));

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

module.exports = app;