var express = require('express');
var app = express();
var port = 36000;

app.use(express.json());
app.use(express.urlencoded( {extended : false } ));

app.use('/list', require('./routes/list'));
app.use('/load', require('./routes/load'));

app.get('/', (req, res, next) => {
    res.json({"result" : true});
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

module.exports = app;