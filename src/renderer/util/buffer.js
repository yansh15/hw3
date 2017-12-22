import { EventEmitter } from 'events'

class TcpBuffer {
  constructor () {
    this.buffers = []
    this.emitter = new EventEmitter(this)
    this.offset = 0
  }

  on (event, callback) {
    this.emitter.on(event, callback)
  }

  emit (event, ...args) {
    this.emitter.emit(event, ...args)
  }

  haveEntireResponse () {
    if (this.buffers.length === 0) {
      return false
    }
    let firstBuffer = this.buffers[0]
    const length = firstBuffer.readUInt32LE(this.offset)
    let index = 1
    let sum = firstBuffer.length - this.offset - 4
    while (sum < length && index < this.buffers.length) {
      sum += this.buffers[index].length
      ++index
    }
    return sum >= length
  }

  getNextEntireResponse () {
    let firstBuffer = this.buffers[0]
    let length = firstBuffer.readUInt32LE(this.offset)
    this.offset = this.offset + 4
    let ret = Buffer.alloc(length)
    let curFirstBufferSize = firstBuffer.length - this.offset
    while (curFirstBufferSize <= length) {
      firstBuffer.copy(ret, ret.length - length, this.offset, firstBuffer.length)
      length = length - curFirstBufferSize
      this.buffers.shift()
      this.offset = 0
      if (this.buffers.length === 0 || length === 0) {
        return ret
      }
      firstBuffer = this.buffers[0]
      curFirstBufferSize = firstBuffer.length - this.offset
    }
    firstBuffer.copy(ret, ret.length - length, this.offset, length)
    this.offset = length
    return ret
  }

  addNewBuffer (buffer) {
    this.buffers.push(buffer)
    while (this.haveEntireResponse()) {
      let response = this.getNextEntireResponse()
      let headerLen = response.readUInt16LE(0)
      let header = response.slice(2, 2 + headerLen)
      let body = response.slice(2 + headerLen)
      this.emitter.emit('response', JSON.parse(header.toString()), body)
    }
  }
}

export default TcpBuffer
