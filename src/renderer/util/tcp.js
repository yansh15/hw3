import { Socket } from 'net'
import util from './index'
import TcpBuffer from './buffer'

class Tcp {
  constructor () {
    this.connect = false
    this.client = new Socket()
    this.callbacks = []
    this.buffer = new TcpBuffer()
    this.socketCloseListener = function () {}
    this.socketErrorListener = function (error) { console.log(error) }
    this.serverMessageListener = function (message) {}
    this.client.on('data', function (data) {
      this.buffer.addNewBuffer(data)
    }.bind(this))
    this.client.on('close', function () {
      this.socketCloseListener()
    }.bind(this))
    this.client.on('error', function (error) {
      this.socketErrorListener(error)
    }.bind(this))
    this.buffer.on('response', function (response, body) {
      response.body = body
      if (typeof this.callbacks[response.uuid] === 'undefined') {
        this.serverMessageListener(response)
      } else if (typeof this.callbacks[response.uuid] === 'function') {
        this.callbacks[response.uuid](response)
        this.callbacks[response.uuid] = true
      }
    }.bind(this))
  }

  // actions number
  REGISTEROP = 0
  LOGINOP = 1
  QUITOP = 2
  SEARCHOP = 3
  ADDOP = 4
  SENDMESSAGEOP = 5
  SENDFILEOP = 6
  SENDFILEDATASTARTOP = 7
  SENDFILEDATAOP = 8
  SENDFILEDATAENDOP = 9
  RECEIVEFILEOP = 10
  RECEIVEFILEDATASTARTOP = 11
  RECEIVEFILEDATAOP = 12
  RECEIVEFILEDATAENDOP = 13

  // global status number
  SUCCESS = 0
  TIMEOUT = 1

  // register error number
  USERNAMEEXIST = 2

  // login error number
  USERNAMENOTEXIST = 2
  PASSWORDWRONG = 3

  setSocketCloseListener (listener) {
    this.socketCloseListener = listener
  }

  setSocketErrorListener (listener) {
    this.socketErrorListener = listener
  }

  setServerMessageListener (listener) {
    this.serverMessageListener = listener
  }

  connectToServer (port, host) {
    return new Promise(function (resolve, reject) {
      this.client.connect(port, host, resolve)
    }.bind(this))
  }

  write (header) {
    const json = JSON.stringify(header)
    const len = Buffer.byteLength(json)
    let data = Buffer.alloc(6 + len)
    data.writeUInt32LE(len + 2)
    data.writeUInt16LE(len, 4)
    data.write(json, 6)
    this.client.write(data)
  }

  setTimeout (uuid, timeout = 3000) {
    setTimeout(function () {
      if (this.callbacks[uuid] !== true) {
        this.callbacks[uuid]({ status: this.TIMEOUT })
      }
      delete this.callbacks[uuid]
    }.bind(this), timeout)
  }

  register (username, password) {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.REGISTEROP,
        uuid: uid,
        username: username,
        password: password
      })
      this.setTimeout(uid)
    }.bind(this))
  }

  login (username, password) {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.LOGINOP,
        uuid: uid,
        username: username,
        password: password
      })
      this.setTimeout(uid)
    }.bind(this))
  }

  quit () {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.QUITOP,
        uuid: uid
      })
      this.setTimeout(uid)
    }.bind(this))
  }

  search () {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.SEARCHOP,
        uuid: uid
      })
      this.setTimeout(uid)
    }.bind(this))
  }

  add (users) {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.ADDOP,
        uuid: uid,
        users: users
      })
      this.setTimeout(uid)
    }.bind(this))
  }

  sendMessage (username, message, time) {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.SENDMESSAGEOP,
        uuid: uid,
        message: {
          username: username,
          message: message,
          time: time
        }
      })
      this.setTimeout(uid)
    }.bind(this))
  }

  sendFile (username, filename, size, time) {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.SENDFILEOP,
        uuid: uid,
        file: {
          username: username,
          filename: filename,
          uuid: uid,
          size: size,
          time: time
        }
      })
      this.setTimeout(uid)
    }.bind(this))
  }
}

export default Tcp
