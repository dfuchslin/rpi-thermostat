const events = require('events')
const UPDATE_INTERVAL = 5000

module.exports = class Thermostat {
  constructor() {
    this.eventEmitter = new events.EventEmitter()
  }
  destroy() {
    this.sensor.destroy()
    this.fan.destroy()
  }
  registerSensor(sensor) {
    sensor.init(this.eventEmitter, this.config)
    this.sensor = sensor
  }
  registerFan(fan) {
    fan.init(this.eventEmitter, this.config)
    this.fan = fan
  }
  start() {
    this.eventEmitter.on('temp', (status) => {
      if (status.error) {
        console.log('Temperature sensor error!', status.error)
        return
      }
      console.log(`handleTemp temp:${JSON.stringify(status)}`)
      let speed = 0
      if (status.temperature > 30.0) {
        speed = 100
      } else if (status.temperature > 28) {
        speed = 75
      } else if (status.temperature > 25) {
        speed = 50
      } else if (status.temperature > 22) {
        speed = 25
      }
      this.fan.setSpeed(speed)
    })
    this.eventEmitter.on('speed', (fanSpeed) => {
      console.log(`handleSpeed speed:${fanSpeed}`)
    })
    setInterval(() => {
      this.sensor.readTemperature()
      this.fan.readSpeed()
    }, UPDATE_INTERVAL)
  }

}
