const request = require('request');
const fs = require('fs');
let {PythonShell} = require('python-shell');

const URL = "http://code-giraffe.iptime.org:36000";
const CLIENT_UPLOAD = "./clientUpload/";
const CLIENT_UPLOAD_LIST = CLIENT_UPLOAD + "list.json";
const CLIENT_FILES = CLIENT_UPLOAD + "data.txt";

// USAGE : raspapp ${SEND_FILE_NAME}

var inputFileName = process.argv[2];
runPixelfy(inputFileName);

function runPixelfy(inputFileName) {
    PythonShell.run('./imageProcessing/pixelfy.py', {args: [inputFileName]}, function (err, results) {
        if (err) throw err;
        var resultPixels = getResultPixelArray(results);
        var pixelText = changePixelText(resultPixels);
        // console.log(pixelText);

        // Send only one data.
        var text = getUUID();
        var fileContent = [pixelText];
        var delayTime = [1000];
        var hasMelody = 0;
        var melody = {
            note_n: 1,
            frequency: [1000],
            duration: [10]
        }

        var option = {
            uri: URL + "/load/upload",
            method: "POST",
            body: {
                text : text,
                content : fileContent,
                delayTime : delayTime,
                hasMelody: hasMelody,
            },
            json: true
        }

        request.post(option, (err, response, resBody) => {
            console.log(resBody);
        });
        // TODO : Upload to server with melody 0...
        // If can, read uploadData.txt at root folder & Upload to server.
    });
}

function getResultPixelArray(results) {
    var resultPixels = [];

    for(var i = 0; i < results.length; i++) {
        resultPixels.push([]);
        var result = results[i].split(" ");
        for(var j = 0; j < result.length; j++) {
            if(result[j].length != 0) resultPixels[i].push(result[j])
        }
    }
    return resultPixels;
}

function changePixelText(resultPixels) {
    var retText = "";
    for(var i = 0; i < resultPixels.length; i++) {
        for(var j = 0; j <  resultPixels[i].length; j++) {
            retText += resultPixels[i][j] + " ";
        }
        retText += "\n"
    }
    return retText;
}

function getUUID() {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

