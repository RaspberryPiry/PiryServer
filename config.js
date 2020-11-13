var fileConfig = {
    list: "./list.json",
    picture: "./upload/",
}

var listConfig = {
    basic : fileConfig.picture + "basic.json",
    composite : fileConfig.picture + "composite.json",
}

module.exports = { fileConfig, listConfig }