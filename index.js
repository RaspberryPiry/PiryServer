var express = require('express');
var app = express();
var port = 36000;

app.use(express.json());

app.use('/list', require('./routes/list'));
app.use('/picture', require('./routes/picture'));

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

module.exports = app;