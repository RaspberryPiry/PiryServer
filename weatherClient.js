const request = require('request');
const fs = require('fs');

const URL = "http://code-giraffe.iptime.org:36000";
const CLIENT_UPLOAD = "./clientUpload/";
const CLIENT_FILES = CLIENT_UPLOAD + "weather.txt";

/*
Need to be below logic.
1. Request weather.
2. Change it into text and save.
*/

request.get(URL + "/list/weather", function (error, response, body) {
    var value = JSON.parse(body);
    var text = "";
    text += "main " + value.main + "\n"
    text += "decription " + value.description + "\n"
    text += "icon " + "TEMP_ICON"+ "\n"
    text += "temp " + String(value.temp) + "\n"
    text += "feels " + String(value.feels_like) + "\n"
    text += "humidity " + String(value.humidity)

    fs.writeFile(CLIENT_FILES, text, () => {});
});
