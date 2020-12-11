const express = require('express');
const router = express.Router();
const fileIO = require("../utils/fileIO");
const listUtils = require("../utils/list");
const config = require("../config");
const { fstat } = require('fs');

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

router.get('/weather', (req, res, next) => {
    fileIO.readJson(config.fileConfig.weather)
    .then((data) => {
        var weather = {
            main : data.weather[0].main,
            description : data.weather[0].description,
            icon: data.weather[0].icon,
            temp : data.main.temp - 273.15,
            feels_like : data.main.feels_like - 273.15,
            humidity : data.main.humidity
        }
        res.json(weather);
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = router;
