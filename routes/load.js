const express = require('express');
const router = express.Router();
const fileIO = require("../utils/fileIO");
const config = require("../config");

function isSameType(target, type) {
    // Check if type`s type is same as target.
    return getType(target) == getType(type);
}

function getType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
}

function getUUID() {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

router.get('/download/:uuid', (req, res, next) => {
    var uuid = req.params.uuid;
    var fileName = config.fileConfig.picture + uuid;
    fileIO.readJson(fileName)
    .then((data) => {
        if(data.hasMelody == 0) {
            return res.json({
                saveTime: data.time,
                text: data.text,
                picture: data.picture,
                delay: data.delay,
                hasMelody: data.hasMelody,
            });
        }
        else {
            return res.json({
                saveTime: data.time,
                text: data.text,
                picture: data.picture,
                delay: data.delay,
                hasMelody: data.hasMelody,
                note_n = data.note,
                frequency = data.frequency,
                duration = data.duration
            });
        }
    })
    .catch((err) => {
        console.log(err);
    })
});

router.post('/upload', (req, res, next) => {
    var text = req.body.text;
    var fileContent = req.body.content;
    var uuid = getUUID() + ".json";
    var delayTime = req.body.delayTime;
    var fileName = config.fileConfig.picture + uuid;
    var hasMelody = req.body.hasMelody;
    var melody = {
        note_n: 1,
        frequency: [1000],
        duration: [10]
    }
    if(hasMelody != 0)  {
        melody.note_n = req.body.note;
        melody.frequency = req.body.frequency;
        melody.duration = req.body.duration;
    }

    if(! isSameType(fileContent, []) || ! isSameType(delayTime, []) ) {
        if(isSameType(fileContent, ""))    {
            try {
                fileContent = JSON.parse(fileContent);
            }
            catch {
                return res.json({ 
                    "saved" : false, 
                    "err_code" : "ERR_003 : Need to send array type of picture." 
                });
            }
        }
        else {
            return res.json({ 
                "saved" : false, 
                "err_code" : "ERR_003 : Need to send array type of picture." 
            });
        }
        if(isSameType(delayTime, "")) {
            try {
                delayTime = JSON.parse(delayTime);
            }
            catch {
                return res.json({ 
                    "saved" : false, 
                    "err_code" : "ERR_003 : Need to send array type of delayTime." 
                });
            }
        }
        else {
            return res.json({ 
                "saved" : false, 
                "err_code" : "ERR_003 : Need to send array type of picture." 
            });
        }
    }
    
    fileIO.saveJsonPicture(fileName, delayTime, text, hasMelody, melody, fileContent);
    fileIO.addJsonList(config.listConfig.composite, uuid);
    
    return res.json({ "saved" : true, "fileName" : uuid });
});

module.exports = router;