import { Socket } from 'net'
import util from './index.js'
import TcpBuffer from './buffer.js'

function Tcp () {
  this.connect = false
  this.client = new Socket()
  this.callbacks = []
  this.buffer = new TcpBuffer()
  this.socketCloseListener = function () {}
  this.socketErrorListener = function (error) { console.log(error) }
  this.serverMessageListener = function (message) {}

  let tcp = this
  this.client.on('data', function (data) {
    tcp.buffer.addNewBuffer(data)
  })
  this.client.on('close', function () {
    tcp.socketCloseListener()
  })
  this.client.on('error', function (error) {
    tcp.socketErrorListener(error)
  })

  this.buffer.on('response', function (response) {
    console.log(response)
    if (typeof tcp.callbacks[response.uuid] === 'undefined') {
      tcp.serverMessageListener(response)
    } else if (typeof tcp.callbacks[response.uuid] === 'function') {
      tcp.callbacks[response.uuid](response)
      tcp.callbacks[response.uuid] = true
    }
  })
}

Tcp.prototype.REGISTEROP = 0
Tcp.prototype.LOGINOP = 1
Tcp.prototype.QUITOP = 2
Tcp.prototype.SEARCHOP = 3
Tcp.prototype.ADDOP = 4
Tcp.prototype.SENDMESSAGEOP = 5

Tcp.prototype.SUCCESS = 0
Tcp.prototype.TIMEOUT = 1

Tcp.prototype.USERNAMEEXIST = 2

Tcp.prototype.USERNAMENOTEXIST = 2
Tcp.prototype.PASSWORDWRONG = 3

Tcp.prototype.setSocketCloseListener = function (listener) {
  this.socketCloseListener = listener
}

Tcp.prototype.setSocketErrorListener = function (listener) {
  this.socketErrorListener = listener
}

Tcp.prototype.setServerMessageListener = function (listener) {
  this.serverMessageListener = listener
}

Tcp.prototype.connectToServer = function (port, host) {
  let tcp = this
  return new Promise(function (resolve, reject) {
    tcp.client.connect(port, host, resolve)
  })
}

Tcp.prototype.write = function (object) {
  const json = JSON.stringify(object)
  const len = Buffer.byteLength(json)
  let data = Buffer.alloc(2 + len)
  data.writeUInt16LE(len)
  data.write(json, 2)
  this.client.write(data)
}

Tcp.prototype.setTimeout = function (uuid) {
  let v = this
  setTimeout(function () {
    if (v.callbacks[uuid] !== true) {
      v.callbacks[uuid]({ status: v.TIMEOUT })
    }
    delete v.callbacks[uuid]
  }, 3000)
}

Tcp.prototype.register = function (username, password) {
  const uid = util.uuid()
  let tcp = this
  return new Promise(function (resolve, reject) {
    tcp.callbacks[uid] = resolve
    tcp.write({
      action: tcp.REGISTEROP,
      uuid: uid,
      username: username,
      password: password
    })
    tcp.setTimeout(uid)
  })
}

Tcp.prototype.login = function (username, password) {
  const uid = util.uuid()
  let tcp = this
  return new Promise(function (resolve, reject) {
    tcp.callbacks[uid] = resolve
    tcp.write({
      action: tcp.LOGINOP,
      uuid: uid,
      username: username,
      password: password
    })
    tcp.setTimeout(uid)
  })
}

Tcp.prototype.quit = function () {
  const uid = util.uuid()
  let tcp = this
  return new Promise(function (resolve, reject) {
    tcp.callbacks[uid] = resolve
    tcp.write({
      action: tcp.QUITOP,
      uuid: uid
    })
    tcp.setTimeout(uid)
  })
}

Tcp.prototype.search = function () {
  const uid = util.uuid()
  let tcp = this
  return new Promise(function (resolve, reject) {
    tcp.callbacks[uid] = resolve
    tcp.write({
      action: tcp.SEARCHOP,
      uuid: uid
    })
    tcp.setTimeout(uid)
  })
}

Tcp.prototype.add = function (users) {
  const uid = util.uuid()
  let tcp = this
  return new Promise(function (resolve, reject) {
    tcp.callbacks[uid] = resolve
    tcp.write({
      action: tcp.ADDOP,
      uuid: uid,
      users: users
    })
    tcp.setTimeout(uid)
  })
}

Tcp.prototype.sendMessage = function (username, message, time) {
  const uid = util.uuid()
  let tcp = this
  return new Promise(function (resolve, reject) {
    tcp.callbacks[uid] = resolve
    tcp.write({
      action: tcp.SENDMESSAGEOP,
      uuid: uid,
      message: {
        username: username,
        message: message,
        time: time
      }
    })
    tcp.setTimeout(uid)
  })
}

export default Tcp
