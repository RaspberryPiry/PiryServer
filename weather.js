const request = require('request');
const fs = require('fs');
const config = require("./config");

var url = "http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=bdc2f0f1228b2beaae3e696c94d61652";
var fileName = config.fileConfig.weather;

request.get(url, (error, response, body) => {
    console.log(body);
   fs.writeFile(fileName, body, () => {}); 
});
