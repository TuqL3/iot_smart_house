import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { MQTTClient } from './utils/mqtt'
import { saveActionHistory } from './controllers/actionHistory.controller'
import { saveDataSensor } from './controllers/dataSensor.controller'

const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () => console.log(`App listen on PORT: ${PORT}`))

// Socket
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173' // Frontend URL
  }
})

let awayMode = false // Biến trạng thái chế độ đi vắng

// Lắng nghe sự kiện từ frontend để bật/tắt chế độ đi vắng
io.on('connection', (socket) => {
  console.log('A user connected', socket.id)

  // Lắng nghe sự kiện toggleAwayMode
  socket.on('toggleAway', (status) => {
    awayMode = status
    console.log(`Away Mode is now ${awayMode ? 'ON' : 'OFF'}`)

    // Nếu bật chế độ đi vắng, tắt tất cả thiết bị (đèn, quạt)
    if (awayMode) {
      MQTTClient.publish('device/led', '0') // Tắt đèn
      MQTTClient.publish('device/fan', '0') // Tắt quạt
    }

    // Gửi thông báo đến frontend về trạng thái chế độ đi vắng
    io.emit('device/away/message', { status: awayMode ? 'true' : 'false' })
  })

  // Lắng nghe các sự kiện khác (ví dụ: toggleLight, toggleFan)
  socket.on('toggleLight', (status) => {
    console.log('Toggle light:', status)
    MQTTClient.publish('device/led', status ? '1' : '0')
  })

  socket.on('toggleFan', (status) => {
    console.log('Toggle fan:', status)
    MQTTClient.publish('device/fan', status ? '1' : '0')
  })

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id)
  })
})

// Lắng nghe MQTT
let count = 0

MQTTClient.on('connect', () => {
  MQTTClient.subscribe([
    'dataSensor',
    'device/led/message',
    'device/fan/message',
    'device/led',
    'device/fan',
    'device/motion'
  ])
})

MQTTClient.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())

  if (topic === 'dataSensor') {
    count += 1
    const dataFromMqtt = JSON.parse(payload.toString())
    const newData = {
      valueTemperature: dataFromMqtt.temperature,
      valueHumidity: dataFromMqtt.humidity,
      valueLight: dataFromMqtt.light,
      valueTotalPower: dataFromMqtt.totalPower,
      valueMotion: dataFromMqtt.motion,
      label: count
    }
    saveDataSensor({
      humidity: newData.valueHumidity.toString(),
      temperature: newData.valueTemperature.toString(),
      light: newData.valueLight.toString(),
      totalPower: newData.valueTotalPower.toString(),
      motion: newData.valueMotion.toString()
    })

    io.emit('dataUpdate', newData)
  }

  if (topic === 'device/led/message') {
    const dataFromMqtt = JSON.parse(payload.toString())
    console.log(dataFromMqtt)
    saveActionHistory({ act: dataFromMqtt.status === 'true' ? 'On' : 'Off', device: 'Light' })
    io.emit('device/led/message', dataFromMqtt)
  }
  if (topic === 'device/fan/message') {
    const dataFromMqtt = JSON.parse(payload.toString())
    console.log(dataFromMqtt)
    saveActionHistory({ act: dataFromMqtt.status === 'true' ? 'On' : 'Off', device: 'Fan' })
    io.emit('device/fan/message', dataFromMqtt)
  }
})
