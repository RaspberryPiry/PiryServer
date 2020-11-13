const fileIO = require("./fileIO");
const config = require("../config");

function collectAllList() {
    var basic = collectBasicList();
    var compos = collectCopositeList();

    return basic + compos;
}

function collectBasicList() {
    fileIO.readJson(config.basic)
    .then((jsonData) => {
        return jsonData.fileList;
    },
    (err) => {
        // TODO : 이상 JSON 파일에 대한 에러처리.
        console.log(err);
    })
}

function collectCopositeList() {
    fileIO.readJson(config.composite)
    .then((jsonData) => {
        return jsonData.fileList;
    },
    (err) => {
        // TODO : 이상 JSON 파일에 대한 에러처리.
        console.log(err);
    })
}

module.exports = { collectAllList, collectBasicList, collectCopositeList};