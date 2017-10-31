let Promise = require("bluebird")

class Visualed {

    constructor() {
        this.MAX_LEDS = 56
        this.activeLeds = 1
        this.color = [0, 0, 0]
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

}

module.export = new Visualed

let app = new Visualed

app.bounce(50)