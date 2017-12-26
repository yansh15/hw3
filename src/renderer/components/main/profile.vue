<template>
  <div id="profile-page">
    <h1>当前用户: {{$store.state.user.username}}</h1>
  </div>
</template>

<script>
export default {
  name: 'profile',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
#profile-page {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F5F5F5;
  h1 {
    color: #606266;
  }
}
</style>
