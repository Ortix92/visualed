var blinkstick = require("blinkstick")
var Promise = require("bluebird")
var rgb = require("color-space/rgb")
var hsv = require("color-space/hsv")

const device = Promise.promisifyAll(blinkstick.findFirst())
class Visualed {

    constructor() {
        this.fps = 60
        this.MAX_LEDS = 56
        this.activeLeds = 30
        this.color = new Array(this.MAX_LEDS)
    }

    run() {
        this.setStripColor(this.color).delay(1 / this.fps).then(() => { this.run(1 / this.fps) })
    }

    swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        return arr
    }

    rainbowSweep(f = 1, j = 0) {

        var sample = j * this.fps / this.MAX_LEDS * f

        if (sample > this.MAX_LEDS) {
            j = 0
            sample = 0
        }

        for (var i = 0; i < this.MAX_LEDS; i++) {
            var pos = (i + sample)
            var h = pos / this.MAX_LEDS * hsv.max[0]
            var color = hsv.rgb([h, hsv.max[1], hsv.max[2]])
            color = this.swap(color, 0, 1)
            this.color[i] = color
        }
        return Promise.resolve().delay(1 / this.fps).then(() => {
            j++
            this.rainbowSweep(f, j)
        })
    }

    rotate(delay, reverse = false) {
        if (reverse)
            this.color.unshift(this.color.pop())
        else
            this.color.push(this.color.shift())
        return Promise.resolve().delay(delay).then(() => { this.rotate(delay, reverse) })
    }

    rainbowSingle(delay, f, i = 0) {
        // Delay is in ms so we divide by 1000
        let sample = i * (delay / 1000)
        if (sample >= 1 / f) {
            i = 0
        }
        // We let the sine wave become negative since it's interpreted as 0
        // This saves us a couple of if statements ;)
        let r = Math.floor((Math.sin(sample * 2 * Math.PI * f)) * 127)
        let g = Math.floor((Math.sin(sample * 2 * Math.PI * f + 2 * Math.PI / 3)) * 127)
        let b = Math.floor((Math.sin(sample * 2 * Math.PI * f + 4 * Math.PI / 3)) * 127)
        this.color = this.singleColorArray(r, g, b)
        // console.log(`[Sample: ${sample}] [i: ${i}] [r: ${r}]`)
        // console.log(sample)
        return Promise.resolve().delay(delay).then(() => {
            i++
            this.rainbowSingle(delay, f, i)
        })
    }

    singleColorArray(r, g, b) {
        let params = device.interpretParameters(r, g, b)
        let arr = new Array(this.activeLeds).fill([params.green, params.red, params.blue])
        let flat = [].concat.apply([], arr)
        return flat
    }

    flatten(colors) {
        return [].concat.apply([], colors)
    }

    setStripColor(colors) {
        var flat = this.flatten(colors)

        // Check if array is not borked
        if(flat[0] === undefined) {
            console.log('Array borked')
            return Promise.reject('Color array contains undefined value at position 0')
        }
        device.setColors(0, flat)
        return Promise.resolve()
    }

    increase(delay) {
        if (this.activeLeds < this.MAX_LEDS) {
            this.activeLeds++
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

    on() {
        this.activeLeds = this.MAX_LEDS
        return Promise.resolve()
    }

    off() {
        let arr = new Array(this.MAX_LEDS * 3).fill(0)
        device.setColors(0, arr)
        return Promise.resolve()
    }

}

module.export = new Visualed

let app = new Visualed
// app.oscillate(10)
app.rainbowSweep(0.5)
app.run()

process.on('SIGINT', function () {
    console.log("Caught interrupt signal");
    app.off()
    process.exit();
})