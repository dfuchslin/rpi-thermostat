const rpio = require('rpio')

module.exports = class PWMFan {
  init(eventEmitter, config = {}) {
    this.eventEmitter = eventEmitter
    rpio.init({
      gpiomem: true,
      mapping: 'gpio'
    })
    rpio.open(25, rpio.INPUT, rpio.PULL_UP)
  }
  destroy() {
    console.log('Cleaning up any fan connections')
    rpio.close(25)
  }
  readSpeed() {
    let pulses = 0
    rpio.poll(25, () => {
      pulses += 1
    }, rpio.POLL_HIGH)
    setTimeout(() => {
      rpio.poll(25, null)
      this.eventEmitter.emit('speed', pulses * 60 / 2)
    }, 1000)
  }
}
