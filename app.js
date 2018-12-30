'use strict'

const MCP9808Sensor = require('./src/mcp9808sensor'),
  PWMFan = require('./src/pwmfan'),
  Thermostat = require('./src/thermostat')

const thermostat = new Thermostat()
thermostat.registerSensor(new MCP9808Sensor())
thermostat.registerFan(new PWMFan())
thermostat.start()
