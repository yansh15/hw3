import fs from 'fs'
import path from 'path'
import os from 'os'
import util from './index'
import Tcp from './tcp'

class ReceiveFileTcp extends Tcp {
  constructor () {
    super()
    this.filename = null
    this.filepath = null
    this.size = 0
    this.fsize = 0
    this.fileuuid = null
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

  dir = path.join(os.homedir(), 'WXFiles')

  setUpdateFSizeListener (listener) {
    this.updateFSizeListener = listener
  }

  createFilenameWithPrefix (num) {
    return (num === 0 ? '' : '(' + num + ')-') + this.filename
  }

  getFilePath () {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir)
    }
    let num = 0
    while (true) {
      this.filepath = path.join(this.dir, this.createFilenameWithPrefix(num))
      if (!fs.existsSync(this.filename)) {
        break
      }
      ++num
    }
  }

  openWriteStream () {
    return new Promise(function (resolve, reject) {
      this.stream = fs.createWriteStream(this.filepath)
      this.stream.on('open', resolve)
    }.bind(this))
  }

  writeDataIntoStream (data) {
    return new Promise(function (resolve, reject) {
      this.stream.write(data, resolve)
    }.bind(this))
  }

  closeWriteStream () {
    return new Promise(function (resolve, reject) {
      this.stream.close()
      this.stream.on('close', resolve)
    }.bind(this))
  }

  async receive (filename, size, fileuuid) {
    this.filename = filename
    this.size = size
    this.fileuuid = fileuuid
    let response = await this.receiveFileDataStart()
    switch (response.status) {
      case this.SUCCESS:
        break
      case this.TIMEOUT:
        console.log('fail')
        return
    }
    this.getFilePath()
    await this.openWriteStream()
    while (this.fsize < this.size) {
      let response = await this.receiveFileData()
      switch (response.status) {
        case this.SUCCESS:
          this.fsize = this.fsize + response.size
          await this.writeDataIntoStream(response.body)
          this.updateFSizeListener(this.fsize)
          break
        case this.TIMEOUT:
          console.log('fail')
          return
      }
    }
    await this.closeWriteStream()
    this.receiveFileDataEnd()
  }

  receiveFileDataStart () {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.RECEIVEFILEDATASTARTOP,
        uuid: uid,
        fileuuid: this.fileuuid
      })
      this.setTimeout(uid, 5000)
    }.bind(this))
  }

  receiveFileData () {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.RECEIVEFILEDATAOP,
        uuid: uid
      })
      this.setTimeout(uid, 5000)
    }.bind(this))
  }

  receiveFileDataEnd () {
    const uid = util.uuid()
    return new Promise(function (resolve, reject) {
      this.callbacks[uid] = resolve
      this.write({
        action: this.RECEIVEFILEDATAENDOP,
        uuid: uid
      })
      this.setTimeout(uid, 5000)
    }.bind(this))
  }
}

export default ReceiveFileTcp
