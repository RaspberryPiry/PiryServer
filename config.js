var fileConfig = {
    picture: "./upload/",
    weather: "./upload/weather.json"
}

var listConfig = {
    basic : fileConfig.picture + "basic.json",
    composite : fileConfig.picture + "composite.json",
}

var portConfig = {
    expressPort : 36000,
    socketPort : 36001
}

module.exports = { fileConfig, listConfig, portConfig }