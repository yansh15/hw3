import { EventEmitter } from 'events'
import { Socket } from 'net'
import util from './index.js'

function Tcp () {
  this.connect = false
  this.client = new Socket()
  this.callbacks = []
  this.emitter = new EventEmitter(this)
}

Tcp.prototype.REGISTEROP = 0
Tcp.prototype.LOGINOP = 1

Tcp.prototype.SUCCESS = 0
Tcp.prototype.TIMEOUT = 1

Tcp.prototype.USERNAMEEXIST = 2

Tcp.prototype.USERNAMENOTEXIST = 2
Tcp.prototype.PASSWORDWRONG = 3

Tcp.prototype.register = function (username, password, callback) {
  const uid = util.uuid()
  this.callbacks[uid] = callback
  const uuidLen = Buffer.byteLength(uid)
  const usernameLen = Buffer.byteLength(username)
  const passwordLen = Buffer.byteLength(password)
  const length = 1 + uuidLen + 2 + 2 + usernameLen + passwordLen
  let offset = 0
  let data = Buffer.alloc(2 + length)
  data.writeUInt16LE(length, offset)
  offset += 2
  data.writeUInt8(this.REGISTEROP, offset)
  offset += 1
  data.write(uid, offset)
  offset += uuidLen
  data.writeUInt16LE(usernameLen, offset)
  offset += 2
  data.writeUInt16LE(passwordLen, offset)
  offset += 2
  data.write(username, offset)
  offset += usernameLen
  data.write(password, offset)
  this.client.write(data)
  let tcp = this
  setTimeout(function () {
    if (tcp.callbacks[uid] !== true) {
      tcp.callbacks[uid]({ status: tcp.TIMEOUT })
    }
    delete tcp.callbacks[uid]
  }, 3000)
}

export default new Tcp()
