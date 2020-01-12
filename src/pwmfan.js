const Gpio = require('pigpio').Gpio
const SX1509 = require('node-sx1509')

module.exports = class PWMFan {
  constructor(config = {}) {
    this.sx1509 = config.sx1509
    this.number = config.number
    this.pwmPin = config.pwmPin
    this.tachPin = config.tachPin
    this.device = `Fan ${this.number}`
  }

  async init(eventEmitter, thermostatConfig = {}) {
    this.eventEmitter = eventEmitter
    this.pulses = 0
    this.dutyCycle = 0
    this.tach = new Gpio(this.tachPin, {
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
    try {
      await this.sx1509.pinMode(this.pwmPin, SX1509.ANALOG_OUTPUT)
    } catch (e) {
      console.log(`${this.device}: error!`, e)
    }

    await this.setSpeed(50)
  }

  async destroy() {
    console.log(`${this.device}: Cleaning up any fan connections`)
  }

  async readSpeed() {
    this.pulses = 0
    setTimeout(() => {
      this.eventEmitter.emit('speed', {
        device: this.device,
        speed: this.pulses * 60 / 2,
        dutyCycle: this.dutyCycle
      })
    }, 1000)
  }

  async setSpeed(percent) {
    this.dutyCycle = percent
    let dutyCycle = Math.floor(255 * percent / 100)
    dutyCycle = dutyCycle > 255 ? 255 : dutyCycle < 0 ? 0 : dutyCycle
    this.sx1509.analogWrite(this.pwmPin, 255 - dutyCycle)
      .catch(e => console.log(`${this.device}: error!`, e))
  }
}
