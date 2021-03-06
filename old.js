var blinkstick = require('blinkstick')
var randint = require('random-int')
var Promise = require("bluebird");
const device = Promise.promisifyAll(blinkstick.findFirst())

const MAX_LEDS = 56
const maxAmp = 100
let activeLeds = 1
let amp = 5
let color = [255, 0, 0]


changeColor()
increaseActiveLeds()
run()

function run() {
    return new Promise((resolve, reject) => {
        setStripColor(...color)
        return resolve()
    }).delay(50).then(run)
}

function increaseActiveLeds() {
    return new Promise((resolve, reject) => {
        if (activeLeds < MAX_LEDS) {
            activeLeds++
        }
        return resolve()
    }).delay(50).then(increaseActiveLeds)
}

function changeColor() {
    return new Promise((resolve, reject) => {

        if (color[0] > 0) {
            color[0] = color[0] - 1
            color[1] = color[1] + 1
        }
        return resolve()
    }).delay(10).then(changeColor)
}

// function run() {
//     return new Promise((resolve, reject) => {
//         // Promise.delay(10).then(() => {return resolve()})

//         Promise.delay(5000)
//             .then(() => { device.setColorAsync("random", { 'channel': 0, 'index': 10 }) })
//             .then(() => { return resolve() })

//     }).then(run)
// }


function setStripColor(r, g, b) {
    return new Promise((resolve, reject) => {

        let params = device.interpretParameters(r, g, b)

        let arr = new Array(activeLeds).fill([params.green, params.red, params.blue])
        let flat = [].concat.apply([], arr)

        device.setColors(0, flat)
        return resolve()
    })

}

function off() {
    let arr = new Array(MAX_LEDS*3).fill(0)
    device.setColors(0, arr)
}

/**
 * Catch interrupt and turn device off
 */
process.on('SIGINT', function () {
    console.log("Caught interrupt signal");
    off()
    process.exit();
})



