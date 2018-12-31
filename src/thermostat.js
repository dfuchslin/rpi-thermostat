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
  handleTemperatureEvent(temperatureStatus) {
    console.log(`handleTemp temp:${JSON.stringify(temperatureStatus)}`)
  }
  handleFanSpeedEvent(fanSpeed) {
    console.log(`handleSpeed speed:${fanSpeed}`)
  }
}
