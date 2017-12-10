<template>
  <div id="index-page" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在连接服务器...">

  </div>
</template>

<script>
export default {
  name: 'index',
  computed: {
    fullscreenLoading () {
      return !this.$store.state.tcp.connect
    }
  }
}
</script>

<style>
#index-page {
  flex: 1 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
