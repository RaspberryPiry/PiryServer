var fileConfig = {
    picture: "./upload/",
    weather: "./upload/weather.json"
}

var listConfig = {
    basic : fileConfig.picture + "basic.json",
    composite : fileConfig.picture + "composite.json",
}

module.exports = { fileConfig, listConfig }