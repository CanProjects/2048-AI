


var grid = { 0: ' ', 1: ' ', 2: ' ', 3: ' ', 4: ' ', 5: ' ', 6: ' ', 7: ' ', 8: ' ', 9: ' ', 10: ' ', 11: ' ', 12: ' ', 13: ' ', 14: ' ', 15: ' ' };
var choices = [];
var lastGrid = [];
var newStateCheck = {}
var shiftLog = [];
var totalLog = [];
var spawnLocation = '';
var counterEgg = 0;
var currentDirect = 0


const softCopy = () => {
    for (let i = 0; i < 16; i++) {
        lastGrid[i] = grid[i]
        newStateCheck[i] = grid[i]
    }

}

const shift = (e1, e2, e3, e4, checker) => {
    var shiftedState = [];
    var shiftTracker = [];

    // There has to be a better way to do this, this is so damn stupid

    var addressBook = {}
    addressBook[parseInt(e1)] = 0;
    addressBook[parseInt(e2)] = 1;
    addressBook[parseInt(e3)] = 2;
    addressBook[parseInt(e4)] = 3;

    // Final codes read (ID, Units to travel)

    //ID

    if (grid[e1] !== ' ') {
        shiftedState.push(grid[e1]);
        shiftTracker.push(e1)
    }
    if (grid[e2] !== ' ') {
        shiftedState.push(grid[e2]);
        shiftTracker.push(e2)
    }
    if (grid[e3] !== ' ') {
        shiftedState.push(grid[e3]);
        shiftTracker.push(e3)
    }
    if (grid[e4] !== ' ') {
        shiftedState.push(grid[e4]);
        shiftTracker.push(e4)
    }

    // Units to travel
    // Use the address book to calculate regardless of what the ID is


    if (shiftedState.length === 1) {
        grid[e1] = ' ';
        grid[e2] = ' ';
        grid[e3] = ' ';
        grid[e4] = shiftedState[0];
        shiftTracker[0] = "" + shiftTracker[0] + ' ' + (3 - addressBook[shiftTracker[0]])
    }

    if (shiftedState.length === 2) {
        grid[e1] = ' ';
        grid[e2] = ' ';
        grid[e3] = shiftedState[0];
        shiftTracker[0] = "" + shiftTracker[0] + ' ' + (2 - addressBook[shiftTracker[0]])
        grid[e4] = shiftedState[1];
        shiftTracker[1] = "" + shiftTracker[1] + ' ' + (3 - addressBook[shiftTracker[1]])
    }

    if (shiftedState.length === 3) {
        grid[e1] = ' ';
        grid[e2] = shiftedState[0];
        shiftTracker[0] = "" + shiftTracker[0] + ' ' + (1 - addressBook[shiftTracker[0]])
        grid[e3] = shiftedState[1];
        shiftTracker[1] = "" + shiftTracker[1] + ' ' + (2 - addressBook[shiftTracker[1]])
        grid[e4] = shiftedState[2];
        shiftTracker[2] = "" + shiftTracker[2] + ' ' + (3 - addressBook[shiftTracker[2]])
    }

    if (shiftedState.length === 4) {
        shiftTracker[0] = shiftTracker[0] + ' ' + 0;
        shiftTracker[1] = shiftTracker[1] + ' ' + 0;
        shiftTracker[2] = shiftTracker[2] + ' ' + 0;
        shiftTracker[3] = shiftTracker[3] + ' ' + 0;
    }

    if (checker === 0) {
        if (grid[e4] !== ' ' && grid[e3] !== ' ' && parseInt(grid[e4]) === parseInt(grid[e3])) {
            grid[e4] = String(parseInt(grid[e4]) * 2);
            grid[e3] = ' ';
            shiftTracker[shiftTracker.length - 2] = (parseInt(shiftTracker[shiftTracker.length - 2].split(" ")[0])) + ' ' + (parseInt(shiftTracker[shiftTracker.length - 2].split(" ")[1]) + 1)

        }
        if (grid[e3] !== ' ' && grid[e2] !== ' ' && parseInt(grid[e3]) === parseInt(grid[e2])) {
            grid[e3] = String(parseInt(grid[e3]) * 2);
            grid[e2] = ' ';
            shiftTracker[shiftTracker.length - 3] = (parseInt(shiftTracker[shiftTracker.length - 3].split(" ")[0])) + ' ' + (parseInt(shiftTracker[shiftTracker.length - 3].split(" ")[1]) + 1)
        }
        if (grid[e2] !== ' ' && grid[e1] !== ' ' && parseInt(grid[e2]) === parseInt(grid[e1])) {
            grid[e2] = String(parseInt(grid[e2]) * 2);
            grid[e1] = ' ';
            shiftTracker[shiftTracker.length - 4] = (parseInt(shiftTracker[shiftTracker.length - 4].split(" ")[0])) + ' ' + (parseInt(shiftTracker[shiftTracker.length - 4].split(" ")[1]) + 1)
        }
        for (let i = 0; i < shiftTracker.length; i++) {
            shiftLog[i] = shiftTracker[i]
        }
    }


    if (checker === 0) {
        if (grid[e3] !== ' ' && grid[e4] === ' ' || grid[e2] !== ' ' && grid[e3] == ' ' || grid[e1] !== ' ' && grid[e2] == ' ') {
            shift(e1, e2, e3, e4, 1)
        }
    }
    // if checker === 1 
    // update the start and endpoint data for the next shift. 

    else {
        for (let i = 0; i < shiftLog.length; i++) {
            for (let z = 0; z < shiftTracker.length; z++) {
                if (parseInt(shiftLog[i].split(' ')[0]) + parseInt(shiftLog[i].split(' ')[1]) === parseInt(shiftTracker[z][0])) {
                    shiftLog[i] = shiftLog[i].split(' ')[0] + ' ' + (parseInt(shiftLog[i].split(' ')[1]) + parseInt(shiftTracker[z].split(' ')[1]))
                }
            }
        }
    }

    // Removes overshooting. Adjusted by direction.
    for (let i = 0; i < shiftLog.length; i++) {
        if (parseInt(shiftLog[i].split(' ')[0]) % 4 < parseInt(shiftLog[i].split(' ')[1]) && currentDirect == 2) {
            shiftLog[i] = shiftLog[i].split(' ')[0] + ' ' + (parseInt(shiftLog[i].split(' ')[0] % 4))
        }
        if ((4 - parseInt(shiftLog[i].split(' ')[0]) % 4) < parseInt(shiftLog[i].split(' ')[1]) && currentDirect == 3) {
            shiftLog[i] = shiftLog[i].split(' ')[0] + ' ' + (4-(parseInt(shiftLog[i].split(' ')[0] % 4)))
        }
        if (Math.floor(parseInt(shiftLog[i].split(' ')[0]) / 4) < parseInt(shiftLog[i].split(' ')[1]) && currentDirect == 0){
            shiftLog[i] = shiftLog[i].split(' ')[0] + ' ' + (Math.floor(parseInt(shiftLog[i].split(' ')[0] / 4)))
        }
        if (4 - Math.floor(parseInt(shiftLog[i].split(' ')[0]) / 4) < parseInt(shiftLog[i].split(' ')[1]) && currentDirect == 1) {
            shiftLog[i] = shiftLog[i].split(' ')[0] + ' ' + (4-Math.floor(parseInt(shiftLog[i].split(' ')[0] / 4)))
        }
    }

    if (checker === 0) {
        for (let i = 0; i < shiftLog.length; i++) {
            totalLog.push(shiftLog[i])
        }
    }
}


const printer = () => {

    for (let i = 0; i < 16; i++) {

        document.getElementById(`${i}`).style.top = '0px'
        document.getElementById(`${i}`).style.left = '0px'
        document.getElementById(`${i}`).innerText = grid[i]
        document.getElementById(`${i}`).style.backgroundColor = 'rgba(238, 228, 218, 0)'
        document.getElementById(`${i}`).style.color = '#776e65'
        document.getElementById(`${i}`).style.fontSize = '50px'
        document.getElementById(`${i}`).style.boxShadow = '0 0 0 0'

        if (grid[i] === '2') {
            document.getElementById(`${i}`).style.backgroundColor = '#caf0f8'
            document.getElementById(`${i}`).style.color = 'black'
            document.getElementById(`${i}`).style.fontSize = '50px'
        }
        else if (grid[i] === '4') {
            document.getElementById(`${i}`).style.backgroundColor = '#ade8f4'
            document.getElementById(`${i}`).style.color = 'black'
            document.getElementById(`${i}`).style.fontSize = '50px'
        }
        else if (grid[i] === '8') {
            document.getElementById(`${i}`).style.backgroundColor = '#90e0ef'
            document.getElementById(`${i}`).style.color = 'black'
            document.getElementById(`${i}`).style.fontSize = '50px'
        }
        else if (grid[i] === '16') {
            document.getElementById(`${i}`).style.backgroundColor = '#48cae4'
            document.getElementById(`${i}`).style.color = 'black'
            document.getElementById(`${i}`).style.fontSize = '50px'
        }
        else if (grid[i] === '32') {
            document.getElementById(`${i}`).style.backgroundColor = '#00b4d8'
            document.getElementById(`${i}`).style.color = 'black'
            document.getElementById(`${i}`).style.fontSize = '50px'
        }
        else if (grid[i] === '64') {
            document.getElementById(`${i}`).style.backgroundColor = '#0096c7'
            document.getElementById(`${i}`).style.color = 'black'
            document.getElementById(`${i}`).style.fontSize = '50px'
        }
        else if (grid[i] === '128') {
            document.getElementById(`${i}`).style.backgroundColor = '#0077b6'
            document.getElementById(`${i}`).style.color = 'white'
            document.getElementById(`${i}`).style.fontSize = '37px'
        }
        else if (grid[i] === '256') {
            document.getElementById(`${i}`).style.backgroundColor = '#023e8a'
            document.getElementById(`${i}`).style.color = 'white'
            document.getElementById(`${i}`).style.fontSize = '38px'
            document.getElementById(`${i}`).style.boxShadow = '0 0 30px 5px rgb(255 255 255 / 25%), inset 0 0 0 1px rgb(255 255 255 / 33%)'
        }
        else if (grid[i] === '512') {
            document.getElementById(`${i}`).style.backgroundColor = '#03045e'
            document.getElementById(`${i}`).style.color = 'white'
            document.getElementById(`${i}`).style.fontSize = '40px'
            document.getElementById(`${i}`).style.boxShadow = '0 0 30px 5px rgb(255 255 255 / 35%), inset 0 0 0 1px rgb(255 255 255 / 33%)'
        }
        else if (grid[i] === '1024') {
            document.getElementById(`${i}`).style.backgroundColor = '#3a0ca3'
            document.getElementById(`${i}`).style.color = 'white'
            document.getElementById(`${i}`).style.fontSize = '40px'
            document.getElementById(`${i}`).style.boxShadow = '0 0 30px 5px rgb(255 255 255 / 40%), inset 0 0 0 1px rgb(255 255 255 / 33%)'
        }
        else if (grid[i] === '2048') {
            document.getElementById(`${i}`).style.backgroundColor = '#480ca8'
            document.getElementById(`${i}`).style.color = 'white'
            document.getElementById(`${i}`).style.fontSize = '40px'


        }
        else if (grid[i] === '4096') {
            document.getElementById(`${i}`).style.backgroundColor = '#b5179e'
            document.getElementById(`${i}`).style.color = 'white'
            document.getElementById(`${i}`).style.fontSize = '40px'
            document.getElementById(`${i}`).style.boxShadow = '0 0 30px 5px rgb(255 255 255 / 55%), inset 0 0 0 1px rgb(255 255 255 / 33%)'
        }

        if (spawnLocation !== '') {
            document.getElementById(`${spawnLocation}`).animate([
                { transform: 'scale(0)' },
                { transform: 'scale(1)' }], 200);
        }
    }

}
const numGen = () => {
    var generatedNum = Math.random();
    if (generatedNum > 0.8) {
        return ('4')
    }
    else {
        return ('2')
    }

}

// Spawner code, for human play.
// const spawner = () => {

//     choices = []
//     for (let i = 0; i < 16; i++) {
//         if (grid[i] === ' ') {
//             choices.push(i);
//         }
//     }
//     if (choices.length !== 0) {
//         spawnLocation = choices[Math.floor(Math.random() * choices.length)]
//         grid[spawnLocation] = (numGen())

//     }
// }


// Spawner for AI

const spawner = () => {
    grid[document.getElementById('giveLoc').value] = document.getElementById('giveVal').value
    spawnLocation = document.getElementById('giveLoc').value
}

const animator = (time, distance, id, direction) => {

    var totalDist = 0;

    var animationTimer = setInterval(function placeHolder() {

        totalDist += (distance / time)
        if (Math.abs(totalDist) <= Math.abs(distance)) {
            if (direction === 'right') {
                document.getElementById(`${id}`).style.left = `${totalDist}px`
            }
            if (direction === 'left') {
                document.getElementById(`${id}`).style.left = `-${totalDist}px`
            }
            if (direction === 'down') {
                document.getElementById(`${id}`).style.top = `${totalDist}px`
            }
            if (direction === 'up') {
                document.getElementById(`${id}`).style.top = `-${totalDist}px`
            }
        }
        else {
            clearInterval(animationTimer)
        }
    }, 1)
}

const animateTile = (direction) => {

    for (let instruction of totalLog) {
        if (instruction.split(' ')[1] !== '0') {
            animator(30, 121.25 * parseInt(instruction.split(' ')[1]), instruction.split(' ')[0], direction)
        }
    }


}

printer()

const redundancy = () => {
    totalLog = totalLog.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })
}


var lastExecution;
window.addEventListener('keydown', function (e) {
    var now = Date.now();
    if (now - lastExecution < 150) {
        return;
    }
    else {
        lastExecution = now;
        switch (e.code) {
            case 'ArrowUp':
                e.preventDefault();
                shiftLog = []
                totalLog = []
                currentDirect = 0
                softCopy()
                shift(12, 8, 4, 0, 0)
                shift(13, 9, 5, 1, 0)
                shift(14, 10, 6, 2, 0)
                shift(15, 11, 7, 3, 0)
                redundancy()
                animateTile('up')
                setTimeout(() => {
                    // For Human play uncomment these along with normal spawner.
                    // if (JSON.stringify(newStateCheck) != JSON.stringify(grid)) {
                    // spawner()}
                    spawner()
                    printer()
                }, 150)
                break;

            case 'ArrowDown':
                e.preventDefault();
                shiftLog = []
                totalLog = []
                currentDirect = 1
                softCopy()
                shift(0, 4, 8, 12, 0)
                shift(1, 5, 9, 13, 0)
                shift(2, 6, 10, 14, 0)
                shift(3, 7, 11, 15, 0)
                redundancy()
                animateTile('down')
                setTimeout(() => {
                    // if (JSON.stringify(newStateCheck) != JSON.stringify(grid)) {
                    //     spawner()
                    // }
                    spawner()
                    printer()
                }, 150)
                break;

            case 'ArrowLeft':
                e.preventDefault();
                shiftLog = []
                totalLog = []
                currentDirect = 2
                softCopy()
                shift(3, 2, 1, 0, 0)
                shift(7, 6, 5, 4, 0)
                shift(11, 10, 9, 8, 0)
                shift(15, 14, 13, 12, 0)
                redundancy()
                animateTile('left')
                setTimeout(() => {
                    // if (JSON.stringify(newStateCheck) != JSON.stringify(grid)) {
                    //     spawner()
                    // }
                    spawner()
                    printer()
                }, 150)
                break;

            case 'ArrowRight':
                e.preventDefault();
                shiftLog = []
                totalLog = []
                currentDirect = 3
                softCopy()
                shift(0, 1, 2, 3, 0)
                shift(4, 5, 6, 7, 0)
                shift(8, 9, 10, 11, 0)
                shift(12, 13, 14, 15, 0)
                redundancy()
                animateTile('right')
                setTimeout(() => {
                    // if (JSON.stringify(newStateCheck) != JSON.stringify(grid)) {
                    //     spawner()
                    // }
                    spawner()
                    printer()
                }, 150)
                break;

            case 'KeyB':
                if (lastGrid.length > 0) {
                    for (let i = 0; i < 16; i++) {
                        grid[i] = lastGrid[i]

                        printer()
                    }
                }
        }
    }
})

const newGameBut = document.getElementById('newGameBut')
const newGrid = document.getElementById('gridGive')
const giveArray = document.getElementById('giveArray')


newGameBut.addEventListener('click', () => {

    grid = { 0: ' ', 1: ' ', 2: ' ', 3: ' ', 4: ' ', 5: ' ', 6: ' ', 7: ' ', 8: ' ', 9: ' ', 10: ' ', 11: ' ', 12: ' ', 13: ' ', 14: ' ', 15: ' ' };
    spawner()
    spawner()
    printer()
}
)

// Defunct code for custom game state
// newGrid.addEventListener('click', (x) => {
//     x.preventDefault()
//     for (let i = 0; i < 16; i++) {
//         if (giveArray.value[i] == 0) {
//             grid[i] = ' '
//         }
//         else {
//             grid[i] = giveArray.value[i]
//         }
//     }

//     printer()
// })



const undoBut = document.getElementById('undoBut')


undoBut.addEventListener('click', function () {
    if (lastGrid.length > 0) {
        for (let i = 0; i < 16; i++) {
            grid[i] = lastGrid[i]
            printer()
        }
    }
})

// Python should tell you the action, and the spawn.

