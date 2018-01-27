const express = require('express')
const app = express()

var visualed = require('./visualed')

app.get('/', (req, res) => {
    if(req.query.v >= 0) {
        visualed.animationSpeed = req.query.v
    }
    res.send('New speed is ' + visualed.animationSpeed)
})

visualed.rainbowSweep()
visualed.run()

app.listen(3000, () => console.log('Example app listening on port 3000!'))