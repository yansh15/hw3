const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

export default {
  uuid: function () {
    let chars = CHARS
    let uid = []
    uid[8] = uid[13] = uid[18] = uid[23] = '-'
    uid[14] = '4'
    for (let i = 0; i < 36; i++) {
      if (!uid[i]) {
        let r = 0 | Math.random() * 16
        uid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
    return uid.join('')
  }
}
