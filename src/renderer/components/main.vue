<template>
  <div id="main-page">
    <div id="main-sidebar">
      <div class="icon-container" @click="quit">
        <i class="el-icon-back"></i>
      </div>
      <div class="icon-container" @click="profile">
        <i class="el-icon-setting"></i>
      </div>
      <div class="icon-container" @click="chat">
        <i class="el-icon-message"></i>
      </div>
    </div>
    <div id="main-content">
      <router-view></router-view>
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
    chat () {
      this.$router.push('/main/chat')
    },
    profile () {
      this.$router.push('/main/profile')
    },
    quit: async function () {
      let response = await this.$tcp.quit()
      switch (response.status) {
        case this.$tcp.SUCCESS:
          this.$message.success('quit successfully')
          this.$store.commit('clearUserInfo')
          this.$router.push('/')
          break
        case this.$tcp.TIMEOUT:
          this.$message.error('network timeout')
          break
      }
    }
  }
}
</script>

<style lang="scss">
$sidebar-width: 50px;
#main-page {
  flex: 1 1 auto;
  display: flex;
}
#main-sidebar {
  flex: 0 0 $sidebar-width;
  display: flex;
  flex-direction: column-reverse;
  background-color: #27292D;
}
.icon-container {
  flex: 0 0 $sidebar-width;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    color: #F5F5F5;
  }
}
#main-content {
  flex: 1 1 auto;
  display: flex;
}
</style>
