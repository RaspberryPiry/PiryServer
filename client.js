const request = require('request');
const fs = require('fs');

const URL = "http://code-giraffe.iptime.org:36000";
const CLIENT_UPLOAD = "./clientUpload/";
const CLIENT_UPLOAD_LIST = "./clientUpload/list.json";
const CLIENT_FILES = "./clientUpload/data.txt";

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
    .then(async (data) => {
        var existFile = data.fileList;
        var notDownloaded = getNotDownloadList(existFile, value.result);
        // Await for not-downloaded files.
        for(var i = 0; i < notDownloaded.length; i++) {
            await downloadImage(notDownloaded[i]);
        }
    })
    .then(async () => {
        fs.writeFile(CLIENT_UPLOAD_LIST, JSON.stringify({fileList : value.result}), () => {});
        // Await for read each json files.
        fs.writeFile(CLIENT_FILES, await portToText(value.result), () => {});
    })
    .catch((err) => {
        console.log(err);
    });
});


function downloadImage(uuid) {
    return new Promise((res, rej) => {
        // UUID 형태가 ./~ 처럼 되어있기에 split 해야함.
        request.get(URL + "/load/download/" + uuid.split("/")[1], function (error, response, body) {
            var value = JSON.parse(body);
            fs.writeFile(CLIENT_UPLOAD + uuid, JSON.stringify(value), () => {});
            res();
        });
    });
}

async function portToText(result)  {
    var resultJson = [];
    for(var i = 0; i < result.length; i++) {
        var resContent = await readAwaitFile(CLIENT_UPLOAD + result[i]);
        resultJson.push(resContent);
    }
    
    var time = getNowTime();
    var retText = "";
    retText += "last_update_time " + time + "\n";
    retText += "Number_of_Animation " + String(result.length) + "\n";
    
    for(var i = 0; i < resultJson.length; i++) {
        console.log(resultJson);
        retText += "#" + String(i + 1) + "\n";
        retText += "name " + resultJson[i].text + "\n";
        retText += "length " + String(resultJson[i].picture.length) + "\n";
        retText += "delay " + String(resultJson[i].delay) + "\n";
        retText += "hasMelody " + resultJson[i].hasMelody + "\n";
        if(resultJson[i].hasMelody == 1) {
            retText += "note_n" + resultJson[i].note_n + "\n";
            retText += "frequency" + resultJson[i].frequency + "\n";
            retText += "duration" + resultJson[i].duration + "\n";
        }

        for(var j = 0; j < resultJson[i].picture.length; j++)  {
            retText += "@IMAGE" + String(j + 1) + "\n";
            retText += resultJson[i].picture[j] + "\n";
        }
    }

    return retText;
}

function getNowTime() {
    var d = new Date();
    var year = String(d.getUTCFullYear());
    var month = formatter(String(d.getMonth()));    
    var date = formatter(String(d.getDate()));
    return year + month + date;
}

function formatter(string) {
    if(string.length == 1) return "0" + string;
    else return string;
}

function readAwaitFile(fileName) {
    return new Promise((res, rej) => {
        fs.readFile(fileName, (err, data) => {
            if(err) rej(err);
            else res(JSON.parse(data));
        })
    })
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