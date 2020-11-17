const request = require('request');

const URL = "http://code-giraffe.iptime.org:36000";

/*
Need to be below logic.
1. Request for all list or composite list.
2. Sync file with not exist one. ( We need to read file list when program wake up. )
3. Download do not saved file.
*/




request.get(URL + "/list/all", function (error, response, body) {
    var value = JSON.parse(body);
    console.log(value.result);
    for(var i = 0; i < value.result.length; i++) {
        downloadImage(value.result[i]);
    }
});

function downloadImage(uuid) {
    request.get(URL + "/load/download/" + uuid, function (error, response, body) {
        var value = JSON.parse(body);
        console.log(value);
    });
}