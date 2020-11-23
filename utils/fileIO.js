var fs = require('fs');

function readJson(fileName) {
    // Read Json And Parse it to data.
    return new Promise((res, rej) => {
        fs.readFile(fileName, (err, data) => {
            if(err) rej(err);
            else res(JSON.parse(data));
        });
    });
}

function refreshJson(fileName, fileLists) {
    var fileContent = {
        fileList : fileLists
    }
    fs.writeFile(fileName, JSON.stringify(fileContent), () => {});

}

function addJsonList(fileName, pictureName) {
    readJson(fileName)
    .then(
        (data)=> {
            data.fileList.push("./" + pictureName);
            refreshJson(fileName, data.fileList)
        },
        (err)=> {
            // TODO : Error catch while read JSON file.
            console.log(err);
        }
    );
}

function saveJsonPicture(fileName, delayTime, textInput, pictureInput) {
    // TODO : add freq, duration, hasMelody, note_n
    var fileContent = {
        time : getNowTime(),
        text : textInput,
        delay : delayTime,
        picture : pictureInput
    }
    fs.writeFile(fileName, JSON.stringify(fileContent), () => {});
}

function getNowTime() {
    var d = new Date();
    var year = String(d.getUTCFullYear());
    year = year[2] + year[3];
    var month = formatter(String(d.getMonth()));    
    var date = formatter(String(d.getDate()));
    var hour = formatter(String(d.getHours()));
    var minute = formatter(String(d.getMinutes()));
    var second = formatter(String(d.getSeconds()));
    return year + month + date + " " + hour + minute + second;
}

function formatter(string) {
    if(string.length == 1) return "0" + string;
    else return string;
}


module.exports = { readJson, addJsonList, saveJsonPicture };