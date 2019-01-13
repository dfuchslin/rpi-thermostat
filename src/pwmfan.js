const Gpio = require('pigpio').Gpio

module.exports = class PWMFan {
  init(eventEmitter, config = {}) {
    var tachPin = 25
    var pwmPin = 24
    this.eventEmitter = eventEmitter
    this.pulses = 0
    this.dutyCycle = 0
    this.tach = new Gpio(tachPin, {
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
    this.pwm = new Gpio(pwmPin, {
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
      this.eventEmitter.emit('speed', {
        speed: this.pulses * 60 / 2,
        dutyCycle: this.dutyCycle
      })
    }, 1000)
  }
  setSpeed(percent) {
    this.dutyCycle = percent
    let dutyCycle = Math.floor(255 * percent / 100)
    dutyCycle = dutyCycle > 255 ? 255 : dutyCycle < 0 ? 0 : dutyCycle
    this.pwm.pwmWrite(dutyCycle)
  }
}
