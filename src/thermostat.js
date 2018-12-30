const events = require('events')
const UPDATE_INTERVAL = 5000

module.exports = class Thermostat {
  constructor() {
    this.eventEmitter = new events.EventEmitter()
    this.eventEmitter.on('temp', this.handleTemperatureEvent)
  }
  registerSensor(sensor) {
    this.sensor = sensor
    this.sensor.eventEmitter = this.eventEmitter
  }
  registerFan(fan) {
    this.fan = fan
    this.fan.eventEmitter = this.eventEmitter
  }
  start() {
    setInterval(() => {
      this.sensor.readTemperature()
      this.fan.readSpeed()
    }, UPDATE_INTERVAL)
  }
  handleTemperatureEvent(temperatureStatus) {
    console.log(`handleTemperatureEvent temperatureStatus:${JSON.stringify(temperatureStatus)}`)
  }
}
