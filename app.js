var blinkstick = require('blinkstick')
var randint = require('random-int')
var Promise = require("bluebird");

const LED_COUNT = 56

const device = Promise.promisifyAll(blinkstick.findFirst())

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
var x = 0
var sign = 1

function run() {
    return new Promise((resolve, reject) => {
        Promise.delay(20)
            .then(() => { device.setColorAsync("random", { 'channel': 0, 'index': x }) })
            .delay(4)
            .then(() => { device.setColorAsync("#000000", { 'channel': 0, 'index': x }) })
            .then(() => {
                x += sign
                if (x == LED_COUNT - 1) {
                    sign = -1
                } else if (x == 0) {
                    sign = 1
                }
                return resolve()
            })
    }).then(run)
}
run()


/**
 * Catch interrupt and turn device off
 */
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    device.turnOff()
    process.exit();
})



