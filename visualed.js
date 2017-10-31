var blinkstick = require("blinkstick")
let Promise = require("bluebird")
const device = Promise.promisifyAll(blinkstick.findFirst())
class Visualed {

    constructor() {
        this.MAX_LEDS = 56
        this.activeLeds = 1
        this.color = [255, 0, 0]
    }

    run(delay) {
        this.setStripColor(...this.color).delay(delay).then(() => { this.run() })
    }

    setStripColor(r, g, b) {
        let params = device.interpretParameters(r, g, b)
        let arr = new Array(this.activeLeds).fill([params.green, params.red, params.blue])
        let flat = [].concat.apply([], arr)
        device.setColors(0, flat)

        return Promise.resolve()

    }

    increase(delay) {
        if (this.activeLeds < this.MAX_LEDS) {
            this.activeLeds++
            console.log(this.activeLeds)
            return Promise.delay(delay).then(() => // implicit return from concise arrow body
                this.increase(delay)
            )
        } else {
            return Promise.resolve()
        }
    }

    decrease(delay) {
        if (this.activeLeds > 0) {
            this.activeLeds--
            console.log(this.activeLeds)
            return Promise.delay(delay).then(() => // implicit return from concise arrow body
                this.decrease(delay)
            )
        } else {
            return Promise.resolve()
        }
    }


    oscillate(delay, increase = true) {
        return this.increase(delay).then(() => this.decrease(delay)).then(() => this.oscillate(delay))
    }

    off() {
        let arr = new Array(this.MAX_LEDS*3).fill(0)
        device.setColors(0, arr)
    }

}

module.export = new Visualed

let app = new Visualed

app.run(10)
app.oscillate(10)

process.on('SIGINT', function () {
    console.log("Caught interrupt signal");
    app.off()
    process.exit();
})