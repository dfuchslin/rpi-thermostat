const Gpio = require('pigpio').Gpio

module.exports = class PWMFan {
  init(eventEmitter, config = {}) {
    this.eventEmitter = eventEmitter
    this.pulses = 0
    this.tach = new Gpio(25, {
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_UP,
      alert: true
    })
    const countPulses = (level) => {
      if (level === 1) {
        this.pulses += 1
      }
    }
    this.tach.on('alert', countPulses)
    this.pwm = new Gpio(24, {
      mode: Gpio.OUTPUT,
      alert: false
    })
    this.setSpeed(25)
  }
  destroy() {
    console.log('Cleaning up any fan connections')
  }
  readSpeed() {
    this.pulses = 0
    setTimeout(() => {
      this.eventEmitter.emit('speed', this.pulses * 60 / 2)
    }, 1000)
  }
  setSpeed(percent) {
    let dutyCycle = Math.floor(255 * percent / 100)
    dutyCycle = dutyCycle > 255 ? 255 : dutyCycle < 0 ? 0 : dutyCycle
    console.log(`set fan dutyCycle:${dutyCycle}`)
    this.pwm.pwmWrite(dutyCycle)
  }
}
