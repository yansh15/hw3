<template>
  <div id="main-page">
    <div id="main-sidebar">
      <div id="main-quit-container" @click="quit">
        <i class="el-icon-back"></i>
      </div>
    </div>
    <div id="main-content">
      <router-view></router-view>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'main',
  data () {
    return {
    }
  },
  methods: {
    quit () {
      let vm = this
      this.$tcp.quit(function (response) {
        switch (response.status) {
          case vm.$tcp.SUCCESS:
            vm.$message.success('quit successfully')
            vm.$store.commit('clearUserInfo')
            vm.$router.push('/')
            break
          case vm.$tcp.TIMEOUT:
            vm.$message.error('network timeout')
            break
        }
      })
    }
  }
}
</script>

<style lang="scss">
$sidebar-width: 50px;
#main-page {
  flex: 1 0 auto;
  display: flex;
}
#main-sidebar {
  flex: 0 0 $sidebar-width;
  display: flex;
  flex-direction: column-reverse;
  background-color: #27292D;
}
#main-quit-container {
  flex: 0 0 $sidebar-width;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    color: #F5F5F5;
  }
}
#main-content {
  flex: 1 0 auto;
  display: flex;
}
</style>
