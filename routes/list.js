const express = require('express');
const router = express.Router();
const fileIO = require("../utils/fileIO");
const listUtils = require("../utils/list");
const config = require("../config");

router.get('/all', (req, res, next) => {
    var fileList = listUtils.collectAllList()
    .then((fileList) => {
        return res.json({"result" : fileList});
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get('/basic', (req, res, next) => {
    var fileList = listUtils.collectBasicList()
    .then((fileList) => {
        return res.json({"result" : fileList});
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get('/composite', (req, res, next) => {
    var fileList = listUtils.collectCopositeList()
    .then((fileList) => {
        return res.json({"result" : fileList});
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = router;
