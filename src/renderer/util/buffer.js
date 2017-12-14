import { EventEmitter } from 'events'

function TcpBuffer () {
  this.buffers = []
  this.emitter = new EventEmitter(this)
  this.offset = 0
}

TcpBuffer.prototype.on = function (event, callback) {
  this.emitter.on(event, callback)
}

TcpBuffer.prototype.emit = function (event, ...args) {
  this.emitter.emit(event, ...args)
}

TcpBuffer.prototype.haveEntireResponse = function () {
  if (this.buffers.length === 0) {
    return false
  }
  let firstBuffer = this.buffers[0]
  const length = firstBuffer.readUInt16LE(this.offset)
  let index = 1
  let sum = firstBuffer.length - this.offset - 2
  while (sum < length && index < this.buffers.length) {
    sum += this.buffers[index].length
    ++index
  }
  return sum >= length
}

TcpBuffer.prototype.getNextEntireResponse = function () {
  let firstBuffer = this.buffers[0]
  let length = firstBuffer.readUInt16LE(this.offset)
  this.offset = this.offset + 2
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

TcpBuffer.prototype.addNewBuffer = function (buffer) {
  this.buffers.push(buffer)
  while (this.haveEntireResponse()) {
    let response = this.getNextEntireResponse()
    this.emitter.emit('response', JSON.parse(response.toString()))
  }
}

export default TcpBuffer
