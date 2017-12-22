import fs from 'fs'
import util from './index'
import Tcp from './tcp'

class SendFileTcp extends Tcp {
  constructor () {
    super()
    this.filename = null
    this.path = null
    this.size = 0
    this.fsize = 0
    this.uuid = null
    this.stream = null
    this.socketCloseListener = function () {
      console.log('connect close')
    }
    this.socketErrorListener = function (error) {
      console.log(error)
    }
    this.updateFSizeListener = function (fsize) {
      console.log(fsize, this.size)
    }
  }

  setUpdateFSizeListener (listener) {
    this.updateFSizeListener = listener
  }

  writeFileData (header, body) {
    const json = JSON.stringify(header)
    const headerLen = Buffer.byteLength(json)
    const bodyLen = body.length
    let data = Buffer.alloc(6 + headerLen)
    data.writeUInt32LE(2 + headerLen + bodyLen)
    data.writeUInt16LE(headerLen, 4)
    data.write(json, 6)
    this.client.write(data)
    this.client.write(body)
  }

  async send (filename, path, size, uuid) {
    this.filename = filename
    this.path = path
    this.uuid = uuid
    this.size = size
    let response = await this.sendFileDataStart()
    switch (response.status) {
      case this.SUCCESS:
        break
      case this.TIMEOUT:
        console.log('fail')
        return
    }
    this.stream = fs.createReadStream(path)
    this.stream.on('data', async function (data) {
      this.stream.pause()
      let response = await this.sendFileData(data)
      switch (response.status) {
        case this.SUCCESS:
          this.fsize = this.fsize + data.length
          this.updateFSizeListener(this.fsize)
          this.stream.resume()
          break
        case this.TIMEOUT:
          console.log('fail')
          // close file stream
      }
    }.bind(this))
    this.stream.on('end', function () {
      this.sendFileDataEnd()
    }.bind(this))
  }

  sendFileDataStart () {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.SENDFILEDATASTARTOP,
        uuid: uid,
        fileuuid: this.uuid,
        size: this.size
      })
      this.setTimeout(uid, 5000)
    }.bind(this))
  }

  sendFileData (data) {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.writeFileData({
        action: this.SENDFILEDATAOP,
        uuid: uid,
        fileuuid: this.uuid,
        size: data.length
      }, data)
      this.setTimeout(uid, 5000)
    }.bind(this))
  }

  sendFileDataEnd () {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.SENDFILEDATAENDOP,
        uuid: uid
      })
      this.setTimeout(uid, 5000)
    }.bind(this))
  }
}

export default SendFileTcp
