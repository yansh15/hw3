/**
 *  friends: [{
 *    username: '',
 *    news: 0,
 *    messages: [
 *      {
 *        type: 'M' or 'F',
 *        time: 0,
 *        direction: 'object' or 'subject'
 *        content: '', (only M)
 *        filename: '', (only F)
 *        size: 0, (only F)
 *        uuid: '' (only F)
 *        fsize: 0 (only F)
 *      }
 *    ]
 *  }]
 *  allUsers: [
 *    {
 *      username: string
 *    }
 *  ]
 */

const state = {
  username: '',
  friends: [],
  curFriendName: '',
  allUsers: []
}

const mutations = {
  login (state, config) {
    state.username = config.username
  },
  updateFriendList (state, config) {
    config.list.map(function (friend) {
      if (state.friends.findIndex(function (item) { return item.username === friend }) === -1) {
        state.friends.push({
          username: friend,
          news: 0,
          messages: []
        })
      }
    })
  },
  updateMessageList (state, config) {
    config.list.map(function (message) {
      const index = state.friends.findIndex(function (item) { return item.username === message.username })
      if (index === -1) {
        return
      }
      state.friends[index].news += 1
      state.friends[index].messages.push({
        type: 'M',
        time: message.time,
        direction: 'object',
        content: message.message
      })
    })
    state.friends.map(function (friend) {
      friend.messages.sort(function (a, b) {
        return a.time > b.time
      })
    })
    state.friends.sort(function (a, b) {
      return a.news < b.news
    })
  },
  updateFileList (state, config) {
    config.list.map(function (file) {
      const index = state.friends.findIndex(function (item) { return item.username === file.username })
      if (index === -1) {
        return
      }
      state.friends[index].news += 1
      state.friends[index].messages.push({
        type: 'F',
        time: file.time,
        direction: 'object',
        filename: file.filename,
        size: file.size,
        uuid: file.uuid,
        fsize: 0
      })
    })
    state.friends.map(function (friend) {
      friend.messages.sort(function (a, b) {
        return a.time > b.time
      })
    })
    state.friends.sort(function (a, b) {
      return a.news < b.news
    })
  },
  clearUserInfo (state, config) {
    state.username = ''
    state.friends = []
  },
  updateAllUserList (state, config) {
    state.allUsers = config.list
  },
  addFriends (state, config) {
    config.list.map(function (item) {
      state.friends.unshift({
        username: item,
        news: 0,
        messages: []
      })
    })
  },
  addMessage (state, config) {
    const index = state.friends.findIndex(function (item) { return item.username === config.username })
    if (config.direction === 'object' && config.username !== state.curFriendName) {
      state.friends[index].news += 1
    }
    state.friends[index].messages.push({
      type: 'M',
      time: config.time,
      direction: config.direction,
      content: config.message
    })
    state.friends.unshift(state.friends.splice(index, 1)[0])
  },
  addFile (state, config) {
    const index = state.friends.findIndex(function (item) { return item.username === config.username })
    if (config.direction === 'object' && config.username !== state.curFriendName) {
      state.friends[index].news += 1
    }
    state.friends[index].messages.push({
      type: 'F',
      time: config.time,
      direction: config.direction,
      filename: config.filename,
      size: config.size,
      uuid: config.uuid,
      fsize: 0
    })
  },
  clearNews (state, config) {
    const index = state.friends.findIndex(function (item) { return item.username === config.username })
    state.friends[index].news = 0
    state.curFriendName = config.username
  },
  updateFileFSize (state, config) {
    const index = state.friends.findIndex(function (item) { return item.username === config.username })
    const fIndex = state.friends[index].messages.findIndex(function (item) { return item.type === 'F' && item.uuid === config.uuid })
    state.friends[index].messages[fIndex].fsize = config.fsize
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
