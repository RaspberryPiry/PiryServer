var express = require('express');
var port = 36000
var app = express();

app.use(express.json());
app.use(express.urlencoded( {extended : false } ));

app.use('/list', require('./routes/list'));
app.use('/load', require('./routes/load'));

app.listen(port, () => {
    console.log(`app listening at http://code-giraffe.iptime.org:${port}`);
});
