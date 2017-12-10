const state = {
  connect: false,
  host: '127.0.0.1',
  port: 8035
}

const mutations = {
  setConnect (state, config) {
    state.connect = config.connect
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
