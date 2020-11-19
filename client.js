const request = require('request');
const fs = require('fs');

const URL = "http://code-giraffe.iptime.org:36000";
const CLIENT_UPLOAD = "./clientUpload/";
const CLIENT_UPLOAD_LIST = "./clientUpload/list.json";
/*
Need to be below logic.
1. Request for all list or composite list.
2. Sync file with not exist one. ( We need to read file list when program wake up. )
3. Download do not saved file.
*/

request.get(URL + "/list/all", function (error, response, body) {
    var value = JSON.parse(body);
    
    // Check exist list and download not-downloaded files.
    showList(CLIENT_UPLOAD_LIST)
    .then((data) => {
        var existFile = data.fileList;
        var notDownloaded = getNotDownloadList(existFile, value.result);
        for(var i = 0; i < notDownloaded.length; i++) {
            downloadImage(notDownloaded[i]);
        }
        fs.writeFile(CLIENT_UPLOAD_LIST, JSON.stringify({fileList : value.result}), () => {});
    })
    .catch((err) => {
        console.log(err);
    });
});


function downloadImage(uuid) {
    request.get(URL + "/load/download/" + uuid, function (error, response, body) {
        var value = JSON.parse(body);
        fs.writeFile(CLIENT_UPLOAD + uuid.split(".")[0] + ".txt", portToText(value), () => {});
    });
}

function portToText(value)  {
    console.log(value);
    var time = value.saveTime;
    var text = value.text;
    var picture = value.picture;
    if(value.melody == undefined) {
        var note_n = 0;
        var frequency = [];
        var duration = [];
    }
    else {
        var note_n = value.note_n;
        var frequency = value.frequency;
        var duration = value.duration;
    }

    // TODO : Porting file into animation version.
    var retText = "";
    retText += "last_update_time 20" + time.split(' ')[0] + "\n";
    retText += "Number_of_Animation 1\n";
    retText += "#1\n";
    retText += "name " + text + "\n";
    retText += "length 1\n";
    retText += "delay 1000\n";
    retText += "hasMelody 0\n";
    retText += "@IMAGE1\n";
    retText += picture;

    return retText
}

function showList(listJson) {
    return new Promise((res, rej) => {
        fs.readFile(listJson, (err, data) => {
            if(err) rej(err);
            else res(JSON.parse(data));
        });
    });
}

function getNotDownloadList(existFile, downloadFile) {
    // check exist and find not download list from download files.
    var retFileList = [];
    for(var i = 0; i < downloadFile.length; i++) {
        if(!isIn(downloadFile[i], existFile)) retFileList.push(downloadFile[i]);
    }
    return retFileList;
}

function isIn(fileName, existFile) {
    for(var i = 0; i < existFile.length; i++) {
        if(existFile[i] == fileName) return true;
    }
    return false;
}