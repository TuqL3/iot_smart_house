import mqtt from 'mqtt'

const protocol = 'mqtt'
const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const username = 'hieu'
const password = 'a'

const connectUrl = `${protocol}://${host}:${port}`

export const MQTTClient = mqtt.connect('mqtt://172.20.10.2', {
  port: 1889,
  clientId,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
  username,
  password
})
