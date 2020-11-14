const express = require('express');
const router = express.Router();
const fileIO = require("../utils/fileIO");
const config = require("../config");

// file 이름을 어떻게 해야할까.. basic 에 있는걸 ../upload/어쩌구.json 으로 읽으면 되겠다.
// file 이름은 uuid 로 알아서 만들어보자.
router.get('/download', (req, res, next) => {
    
});

router.post('/upload', (req, res, next) => {
    var text = req.body. text;
    var fileContent = req.body.content;

});

module.exports = router;