import { Socket } from 'net'
import util from './index.js'
import TcpBuffer from './buffer.js'

function Tcp () {
  this.connect = false
  this.client = new Socket()
  this.callbacks = []
  this.buffer = new TcpBuffer()
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

Tcp.prototype.register = function (username, password, callback) {
  const uid = util.uuid()
  this.callbacks[uid] = callback
  this.write({
    action: this.REGISTEROP,
    uuid: uid,
    username: username,
    password: password
  })
  this.setTimeout(uid)
}

Tcp.prototype.login = function (username, password, callback) {
  const uid = util.uuid()
  this.callbacks[uid] = callback
  this.write({
    action: this.LOGINOP,
    uuid: uid,
    username: username,
    password: password
  })
  this.setTimeout(uid)
}

Tcp.prototype.quit = function (callback) {
  const uid = util.uuid()
  this.callbacks[uid] = callback
  this.write({
    action: this.QUITOP,
    uuid: uid
  })
  this.setTimeout(uid)
}

Tcp.prototype.search = function (callback) {
  const uid = util.uuid()
  this.callbacks[uid] = callback
  this.write({
    action: this.SEARCHOP,
    uuid: uid
  })
  this.setTimeout(uid)
}

Tcp.prototype.add = function (username, callback) {
  const uid = util.uuid()
  this.callbacks[uid] = callback
  this.write({
    action: this.ADDOP,
    uuid: uid,
    username: username
  })
  this.setTimeout(uid)
}

Tcp.prototype.sendMessage = function (username, message, time, callback) {
  const uid = util.uuid()
  this.callbacks[uid] = callback
  this.write({
    action: this.SENDMESSAGEOP,
    uuid: uid,
    username: username,
    message: message,
    time: time
  })
  this.setTimeout(uid)
}

Tcp.prototype.handleServerMessage = function (app, message) {
  switch (message.action) {
    case this.ADDOP:
      app.$store.commit('addFriend', {
        username: message.username
      })
      break
    case this.SENDMESSAGEOP:
      message.message.direction = 'object'
      app.$store.commit('addMessage', message.message)
      break
  }
}

export default new Tcp()
