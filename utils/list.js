import { readJson } from "fileIO.js";
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

export { collectAllList, collectBasicList, collectCopositeList};