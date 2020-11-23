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

function getType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
}

function isSameType(target, type) {
    // Check if type`s type is same as target.
    return list.getType(target) == list.getType(type);
}

module.exports = { collectAllList, collectBasicList, collectCopositeList, getType, isSameType };