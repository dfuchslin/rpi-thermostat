'use strict'

const MCP9808Sensor = require('./src/mcp9808sensor')
const SX1509 = require('node-sx1509')
const PWMFan = require('./src/pwmfan')
const Thermostat = require('./src/thermostat')

async function run() {

  const sx1509 = new SX1509(1)
  await sx1509.begin({ busNumber: 1, deviceAddress: 0x3E })

  const thermostat = new Thermostat()
  await thermostat.registerSensor(new MCP9808Sensor())
  await thermostat.registerFan(new PWMFan({ sx1509, number: 1, pwmPin: 0, tachPin: 18 }))
  await thermostat.registerFan(new PWMFan({ sx1509, number: 2, pwmPin: 1, tachPin: 25 }))
  await thermostat.registerFan(new PWMFan({ sx1509, number: 3, pwmPin: 2, tachPin: 27 }))
  thermostat.start()

  process.on('SIGINT', () => {
    console.log('Closing down...')
    thermostat.destroy()
    process.exit()
  })
}

run().catch(e => console.log(e))
