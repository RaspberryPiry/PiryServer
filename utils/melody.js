MELODY_NUMBER = [5, 5, 5]

function getMelody(type){
    if(type >= 0 && type <= 2) {
        var index = 0;
        for(var i = 0; i < type; i++) {
            index += MELODY_NUMBER[i]
        }
        return index + parseInt(Math.random() * MELODY_NUMBER[type])
    }
    else {
        return -1;
    }
}


module.exports = { MELODY_NUMBER, getMelody };