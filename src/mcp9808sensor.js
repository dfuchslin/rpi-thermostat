const Mcp9808 = require('mcp9808-temperature-sensor')
const UNKNOWN_TEMPERATURE = -237.15

module.exports = class MCP9808Sensor {
  init(eventEmitter, config = {}) {
    this.eventEmitter = eventEmitter
    this.setStatusOk(UNKNOWN_TEMPERATURE)
  }
  destroy() {
    console.log('Cleaning up any MCP9808 sensor connections')
  }
  setStatusOk(temp) {
    this.status = {
      temperature: temp,
      timestamp: new Date(),
      error: ''
    }
  }
  setStatusError(error) {
    this.status = {
      temperature: this.status.temperature,
      timestamp: new Date(),
      error
    }
  }
  readTemperature() {
    Mcp9808.open({
      i2cBusNumber: 1,
      i2cAddress: 0x18,
      resolution: Mcp9808.RESOLUTION_1_4
    }).
      then((sensor) => {
        this.tempSensor = sensor
        return this.tempSensor.temperature()
      }).
      then((temp) => {
        this.setStatusOk(temp.celsius)
        this.eventEmitter.emit('temp', this.status)
        return this.tempSensor.close()
      }).
      catch((err) => {
        this.setStatusError(err.stack)
        this.eventEmitter.emit('temp', this.status)
        return this.tempSensor.close()
      })
  }
}
