<template>
  <div id="network-error-page">
    <el-card :body-style="bodyStyle">
      <p id="network-error-tip">连接服务器失败</p>
      <el-button round size="small" type="primary" @click="retryConnect">重试</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'network-error',
  data () {
    return {
      bodyStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  },
  methods: {
    retryConnect () {
      let vm = this
      this.$tcp.client.connect(this.$store.state.tcp.port, this.$store.state.tcp.host, function () {
        vm.$store.commit('setConnect', {connect: true})
      })
    }
  }
}
</script>

<style>
#network-error-page {
  flex: 1 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
#network-error-tip {
  font-size: 150%;
}
</style>
