<template>
  <div id="index-page" v-loading.fullscreen.lock="waiting" :element-loading-text="waitingTip">
    <el-tabs v-model="mode" tab-position="left">
      <el-tab-pane label="登录" name="login">
        <el-form :model="loginInfo" status-icon :rules="loginRules" ref="form" label-width="75px" label-position="left" size="small">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="loginInfo.username" autofocus></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginInfo.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <el-form :model="registerInfo" status-icon :rules="registerRules" ref="form" label-width="75px" label-position="left" size="small">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="registerInfo.username" autofocus></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registerInfo.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import util from '../util/index'
export default {
  name: 'index',
  data () {
    let validateUsername = function (rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (!util.usernameRegex.test(value)) {
        callback(new Error('请使用 4 - 64 位英文字母与数字'))
      } else {
        callback()
      }
    }
    let validatePassword = function (rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!util.passwordRegex.test(value)) {
        callback(new Error('请使用 4 - 64 位英文字母与数字'))
      } else {
        callback()
      }
    }
    return {
      mode: 'login',
      loginInfo: {
        username: '',
        password: ''
      },
      registerInfo: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      registerRules: {
        username: [
          { validator: validateUsername, trigger: 'change' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'change' },
          { validator: validatePassword, trigger: 'blur' }
        ]
      },
      waitingResponse: false,
      waitingTip: '正在连接服务器...'
    }
  },
  computed: {
    waitingConnection () {
      return !this.$store.state.tcp.connect
    },
    waiting () {
      return this.waitingConnection || this.waitingResponse
    }
  },
  methods: {
    register () {
      this.waitingResponse = true
      this.waitingTip = '注册中...'
      let vm = this
      this.$tcp.register(this.registerInfo.username, this.registerInfo.password, function (response) {
        vm.waitingResponse = false
        vm.waitingTip = ''
        switch (response.status) {
          case vm.$tcp.SUCCESS:
            vm.$message.success('register successfully')
            vm.$store.commit('login', { username: vm.registerInfo.username })
            vm.$router.push('/main/chat')
            break
          case vm.$tcp.TIMEOUT:
            vm.$message.error('network timeout')
            break
          case vm.$tcp.USERNAMEEXIST:
            vm.$message.error('username exist')
            break
        }
      })
    },
    login () {
      this.waitingResponse = true
      this.waitingTip = '登录中...'
      let vm = this
      this.$tcp.login(this.loginInfo.username, this.loginInfo.password, function (response) {
        vm.waitingResponse = false
        vm.waitingTip = ''
        switch (response.status) {
          case vm.$tcp.SUCCESS:
            vm.$message.success('login successfully')
            vm.$store.commit('login', { username: vm.loginInfo.username })
            vm.$store.commit('updateFriendList', { list: response.friends })
            vm.$store.commit('updateMessageList', { list: response.messages })
            vm.$store.commit('updateFileList', { list: response.files })
            vm.$router.push('/main/chat')
            break
          case vm.$tcp.TIMEOUT:
            vm.$message.error('network timeout')
            break
          case vm.$tcp.USERNAMENOTEXIST:
            vm.$message.error('username not exist')
            break
          case vm.$tcp.PASSWORDWRONG:
            vm.$message.error('password wrong')
            break
        }
      })
    }
  }
}
</script>

<style>
#index-page {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
