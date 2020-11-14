const express = require('express');
const router = express.Router();
const fileIO = require("../utils/fileIO");
const config = require("../config");

router.get('/download/:uuid', (req, res, next) => {
    var uuid = req.params.uuid;
    var fileName = config.fileConfig.picture + uuid;
    fileIO.readJson(fileName)
    .then((data) => {
        return res.json({
            saveTime: data.time,
            text: data.text,
            picture: data.picture
        });
    })
    .catch((err) => {
        console.log(err);
    })
});

router.post('/upload', (req, res, next) => {
    var text = req.body.text;
    var fileContent = req.body.content;
    var uuid = getUUID() + ".json";
    var fileName = config.fileConfig.picture + uuid;

    fileIO.saveJsonPicture(fileName, text, fileContent);
    fileIO.addJsonList(config.listConfig.composite, uuid);
    return res.json({ "saved" : true, "fileName" : uuid });
});

function getUUID() {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = router;