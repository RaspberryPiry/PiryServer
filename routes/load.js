const express = require('express');
const router = express.Router();
var fs = require('fs');

import { readJson, addJsonList, saveJsonPicture } from "../utils/fileIO.js";
import { fileConfig, listConfig } from "../config.js";



router.get('/download', (req, res, next) => {

});

router.post('/upload', (req, res, next) => {

});