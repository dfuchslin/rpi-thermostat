const events = require('events')
const UPDATE_INTERVAL = 5000

module.exports = class Thermostat {
  constructor() {
    this.eventEmitter = new events.EventEmitter()
    this.sensors = []
    this.fans = []
  }

  async destroy() {
    this.sensors.forEach(async sensor => sensor.destroy())
    this.fans.forEach(async fan => fan.destroy())
  }

  async registerSensor(sensor) {
    await sensor.init(this.eventEmitter, this.config)
    this.sensors.push(sensor)
  }

  async registerFan(fan) {
    await fan.init(this.eventEmitter, this.config)
    this.fans.push(fan)
  }

  async start() {
    this.eventEmitter.on('temp', (status) => {
      if (status.error) {
        console.log(`${status.device} error!`, status.error)
        return
      }
      console.log(`${status.device}: handleTemp temp:${JSON.stringify(status)}`)
      let speed = 15
      if (status.temperature > 30.0) {
        speed = 100
      } else if (status.temperature > 28) {
        speed = 75
      } else if (status.temperature > 25) {
        speed = 50
      } else if (status.temperature > 22) {
        speed = 25
      }
      this.fans.forEach(async fan => fan.setSpeed(speed))
    })
    this.eventEmitter.on('speed', (status) => {
      console.log(`${status.device}: handleSpeed speed:${status.speed} dutyCycle:${status.dutyCycle}`)
    })
    setInterval(() => {
      this.sensors.forEach(async sensor => sensor.readTemperature())
      this.fans.forEach(async fan => fan.readSpeed())
    }, UPDATE_INTERVAL)
  }
}
