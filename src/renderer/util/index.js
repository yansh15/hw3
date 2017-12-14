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
  },
  getStringFromSeconds: function (seconds) {
    return new Date(1000 * seconds).toLocaleString()
  },
  getDateStringFromSeconds: function (seconds) {
    return new Date(1000 * seconds).toLocaleDateString()
  },
  getTimeStringFromSeconds: function (seconds) {
    return new Date(1000 * seconds).toLocaleTimeString()
  },
  getCurrentSeconds: function () {
    return Math.ceil(new Date().getTime() / 1000)
  },
  usernameRegex: /^[A-Za-z0-9]{4,64}$/,
  passwordRegex: /^[A-Za-z0-9]{4,64}$/
}
