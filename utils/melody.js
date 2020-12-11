MELODY_NUMBER = [5, 5, 5]

const melodyPaper = [
    [
        {
            freuquency : [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
            duration : [10, 20, 30, 40, 50, 60, 70, 80],
            note_n : 8
        }
    ],
    [
        {
            freuquency : [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
            duration : [10, 20, 30, 40, 50, 60, 70, 80],
            note_n : 8
        }
    ],
    [
        {
            freuquency : [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
            duration : [10, 20, 30, 40, 50, 60, 70, 80],
            note_n : 8
        }
    ]
]



function getMelody(type){
    if(type >= 0 && type <= 2) {
        return melodyPaper[type][parseInt(Math.random() * melodyPaper[type].length)]
    }
    else {
        return -1;
    }
}


module.exports = { MELODY_NUMBER, getMelody };