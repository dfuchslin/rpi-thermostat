const events = require('events')
const UPDATE_INTERVAL = 5000

module.exports = class Thermostat {
  constructor() {
    this.eventEmitter = new events.EventEmitter()
    this.eventEmitter.on('temp', this.handleTemperatureEvent)
    this.eventEmitter.on('speed', this.handleFanSpeedEvent)
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
    setInterval(() => {
      this.sensor.readTemperature()
      this.fan.readSpeed()
    }, UPDATE_INTERVAL)
  }
  handleTemperatureEvent(status) {
    if (status.error) {
      console.log('Temperature sensor error!', status.error)
      return 
    }
    console.log(`handleTemp temp:${JSON.stringify(status)}`)
    if (status.temperature > 30.0) {
      this.fan.setSpeed(100)
    } else if (status.temperature > 27) {
      this.fan.setSpeed(75)
    } else if (status.temperature > 25) {
      this.fan.setSpeed(50)
    } else if (status.temperature > 22) {
      this.fan.setSpeed(25)
    } else {
      this.fan.setSpeed(0)
    }
  }
  handleFanSpeedEvent(fanSpeed) {
    console.log(`handleSpeed speed:${fanSpeed}`)
  }
}
