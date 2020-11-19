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
    })
    .catch((err) => {
        console.log(err);
    });
});


function downloadImage(uuid) {
    request.get(URL + "/load/download/" + uuid, function (error, response, body) {
        var value = JSON.parse(body);
        fs.writeFile(CLIENT_UPLOAD + uuid, JSON.stringify(fileContent), () => {});
    });
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
    for(var i = 0; i < existFile.lenght; i++) {
        if(!isIn(existFile[i], downloadFile)) retFileList.push(existFile[i]);
    }
    return retFileList;
}

function isIn(fileName, downloadFile) {
    for(var i = 0; i < downloadFile.length; i++) {
        if(downloadFile[i] == fileName) return true;
    }
    return false;
}