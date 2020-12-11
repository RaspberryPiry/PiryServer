const express = require('express');
const router = express.Router();
const fileIO = require("../utils/fileIO");
const melodyUtil = require("../utils/melody");
const config = require("../config");
const multer = require("multer");
let {PythonShell} = require('python-shell');

const storage = multer.diskStorage({
    destination: config.fileConfig.picture,
    filename: function (req, file, next) {
        var fileS = file.originalname.split(".");
        next(null, "I_" + getUUID() + "." + fileS[fileS.length - 1]);
    },
});

const upload = multer({ storage: storage });

function isSameType(target, type) {
    // Check if type`s type is same as target.
    return getType(target) == getType(type);
}

function getType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
}

router.get('/download/:uuid', (req, res, next) => {
    var uuid = req.params.uuid;
    console.log("Download URL " + uuid);
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
                note_n : data.note_n,
                frequency : data.frequency,
                duration : data.duration
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
    var melody = -1;
    /*
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
    */

    if(hasMelody != 0) {
        var melody = melodyUtil.getMelody(req.body.type);
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
        /*
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
        */
    }
    
    fileIO.saveJsonPicture(fileName, delayTime, text, hasMelody, melody, fileContent);
    fileIO.addJsonList(config.listConfig.composite, uuid);
    
    return res.json({ "saved" : true, "fileName" : uuid });
});

router.post('/pixelfy', upload.single("img"), (req, res, next) => {
    var inputFileName = config.fileConfig.picture + req.file.filename;

    PythonShell.run('./imageProcessing/pixelfy.py', {args: [inputFileName]}, function (err, results) {
        if (err) throw err;
        var resultPixels = [];
        var fileS = inputFileName.split(".");
        var extension = fileS[fileS.length - 1];
        if(extension == "gif" || extension == "mp4")  {
            var nowScreenNumber = 0;
            resultPixels.push([]);
            for(var i = 0; i < results.length; i++) {
                if(results[i].length == 0 && i != results.length - 1) {
                    resultPixels.push([]);
                    nowScreenNumber += 1;
                }
                else {
                    resultPixels[nowScreenNumber].push([])
                    var result = results[i].split(" ");
                    for(var j = 0; j < result.length; j++) {
                        if(result[j].length != 0) resultPixels[nowScreenNumber][resultPixels[nowScreenNumber].length - 1].push(result[j])
                    }
                }
            }
        }
        else {
            for(var i = 0; i < results.length; i++) {
                resultPixels.push([]);
                var result = results[i].split(" ");
                for(var j = 0; j < result.length; j++) {
                    if(result[j].length != 0) resultPixels[i].push(result[j])
                }
            }
        }
        res.json({
            result: true,
            pixel: resultPixels
        });
    });
    
});

function getUUID() {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = router;
