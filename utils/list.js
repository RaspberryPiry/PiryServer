const fileIO = require("./fileIO");
const config = require("../config");

function collectAllList() {
    return new Promise((res, rej) => {
        var fileList;
        collectBasicList()
        .then((basicFileList) =>{
            fileList = basicFileList;
            return collectCopositeList();
        })
        .then((compositeFileList)=> {
            var arrList = [];
            for(var i = 0; i < fileList.length; i++) arrList.push(fileList[i]);
            for(var i = 0; i < compositeFileList.length; i++) arrList.push(compositeFileList[i]);
            res(arrList);
        })
        .catch((err) => {
            rej(err);
        })
    });
}

function collectBasicList() {
    return new Promise((res, rej) => {
        fileIO.readJson(config.listConfig.basic)
        .then((jsonData) => { res(jsonData.fileList) },
        (err) => { rej(err) })
    });
}

function collectCopositeList() {
    return new Promise((res, rej) => {
        fileIO.readJson(config.listConfig.composite)
        .then((jsonData) => { res(jsonData.fileList) },
        (err) => { rej(err) })
    });
}

module.exports = { collectAllList, collectBasicList, collectCopositeList };