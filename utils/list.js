var fs = require('fs');
import { fileConfig, listConfig } from "../config.js";

function collectAllList() {
    var basic = collectBasicList();
    var compos = collectCopositeList();

    return basic + compos;
}

function collectBasicList() {
    readJson(listConfig.basic)
    .then((jsonData) => {
        return jsonData.fileList;
    },
    (err) => {
        // TODO : 이상 JSON 파일에 대한 에러처리.
        console.log(err);
    })
}

function collectCopositeList() {
    readJson(listConfig.composite)
    .then((jsonData) => {
        return jsonData.fileList;
    },
    (err) => {
        // TODO : 이상 JSON 파일에 대한 에러처리.
        console.log(err);
    })
}

function readJson(fileName) {
    // Read Json And Parse it to data.
    return Promise((res, rej) => {
        fs.readFile(fileName, (err, data) => {
            if(err) rej(err);
            else res(JSON.parse(data));
        });
    });
}

export { collectAllList, collectBasicList, collectCopositeList};