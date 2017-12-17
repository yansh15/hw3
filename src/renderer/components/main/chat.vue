<template>
  <div id="chat-page">
    <div id="chat-friend">
      <div id="char-friend-toolbar">
        <div id="char-friend-toolbar-input">
          <el-input placeholder="搜索" size="mini" suffix-icon="el-icon-search" v-model="friendFilterText"></el-input>
        </div>
        <div id="char-friend-toolbar-button">
          <el-button size="mini" icon="el-icon-plus" @click="openSearchDialog"></el-button>
        </div>
      </div>
      <div id="char-friend-list">
        <div class="char-friend-list-item" v-for="(item, index) in friendList" :key="index" @click="handleClickFriend(item)">
          <p class="username">{{item.username}}</p>
          <el-badge :value="item.news" :max="99"></el-badge>
          <p class="time">{{getLastMessageTime(item)}}</p>
          <p class="content">{{getLastMessageContent(item)}}</p>
        </div>
      </div>
    </div>
    <div id="chat-window" v-if="curFriend.username !== ''">
      <div id="chat-window-title">
        <p class="username">{{curFriend.username}}</p>
      </div>
      <div id="chat-window-up">
        <div v-for="(item, index) in curFriend.messages" :key="index">
          <message-box :time="getStringFromSeconds(item.time)" :content="item.content" :subject="item.direction === 'subject'"></message-box>
        </div>
      </div>
      <div id="chat-window-down">
        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="sendText"></el-input>
        <el-button id="chat-window-down-button" size="mini" type="success" :plain="true" :disabled="sendText === ''" @click="handleSendMessage">发送</el-button>
      </div>
    </div>
    <el-dialog title="添加好友" append-to-body modal-append-to-body :visible.sync="searchDialogVisible" width="50%" center>
      <el-input size="mini" placeholder="搜索" suffix-icon="el-icon-search" v-model="searchFilterText"></el-input>
      <el-table max-height="200" size="small" :show-header="false" :data="allUserList" :default-sort="{prop: 'username', order: 'ascending'}" empty-text="暂无其他用户" @selection-change="handleSelectChange">
        <el-table-column type="selection" min-width="50" align="center"></el-table-column>
        <el-table-column sortable prop="username" label="用户名" min-width="200" :sort-method="sortUsername" show-overflow-tooltip align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelSearchDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirmSearchDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../util/index'
import MessageBox from '../common/messagebox'
export default {
  name: 'chat',
  data () {
    return {
      curFriend: {
        username: '',
        news: 0,
        messages: []
      },
      friendFilterText: '',
      sendText: '',
      searchDialogVisible: false,
      searchFilterText: '',
      selection: []
    }
  },
  computed: {
    friendList () {
      let vm = this
      return this.$store.state.user.friends.filter(function (item) {
        if (vm.friendFilterText === '') {
          return true
        } else {
          return item.username.indexOf(vm.friendFilterText) > -1
        }
      })
    },
    allUserList () {
      let vm = this
      let f = [this.$store.state.user.username]
      this.$store.state.user.friends.map(function (item) {
        f.push(item.username)
      })
      return this.$store.state.user.allUsers.filter(function (item) {
        if (f.indexOf(item.username) > -1) {
          return false
        }
        if (vm.searchFilterText === '') {
          return true
        }
        return item.username.indexOf(vm.searchFilterText) > -1
      })
    }
  },
  mounted () {
    this.$watch('curFriend.messages', function (newVal, oldVal) {
      const div = document.getElementById('chat-window-up')
      div.scrollTop = div.scrollHeight
    })
  },
  methods: {
    getLastMessageTime (friend) {
      if (friend.messages.length === 0) {
        return ''
      }
      return util.getTimeStringFromSeconds(friend.messages[friend.messages.length - 1].time)
    },
    getLastMessageContent (friend) {
      if (friend.messages.length === 0) {
        return ''
      }
      return friend.messages[friend.messages.length - 1].content
    },
    openSearchDialog: async function () {
      this.searchDialogVisible = true
      let response = await this.$tcp.search()
      this.$store.commit('updateAllUserList', {list: response.users})
    },
    sortUsername (a, b) {
      return a.username.localeCompare(b.username, 'zh') < 0
    },
    handleSelectChange (selection) {
      this.selection = selection
    },
    handleCancelSearchDialog () {
      this.searchDialogVisible = false
      this.searchFilterText = ''
      this.selection = []
    },
    handleConfirmSearchDialog: async function () {
      this.searchDialogVisible = false
      this.searchFilterText = ''
      const newFriends = this.selection.map(function (item) {
        return item.username
      })
      this.selection = []
      let response = await this.$tcp.add(newFriends)
      switch (response.status) {
        case this.$tcp.SUCCESS:
          this.$message.success('add friends successfully')
          this.$store.commit('addFriends', {list: newFriends})
          break
        case this.$tcp.TIMEOUT:
          this.$message.error('network timeout')
          break
      }
    },
    handleClickFriend (friend) {
      this.curFriend = friend
      this.$store.commit('clearNews', {username: friend.username})
    },
    getStringFromSeconds (seconds) {
      return util.getStringFromSeconds(seconds)
    },
    handleSendMessage: async function () {
      const username = this.curFriend.username
      const message = this.sendText
      const time = util.getCurrentSeconds()
      let response = await this.$tcp.sendMessage(username, message, time)
      switch (response.status) {
        case this.$tcp.SUCCESS:
          this.sendText = ''
          this.$store.commit('addMessage', {
            username: username,
            time: time,
            message: message,
            direction: 'subject'
          })
          break
        case this.$tcp.TIMEOUT:
          this.$message.error('network timeout')
          break
      }
    }
  },
  components: {
    MessageBox
  }
}
</script>

<style lang="scss">
$sidebar-width: 50px;
#chat-page {
  flex: 1 0 auto;
  display: flex;
  background-color: #F5F5F5;
}
#chat-friend {
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
  background-color: #EEEBE8;
}
#char-friend-toolbar {
  flex: 0 0 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#char-friend-toolbar-input {
  margin-left: 15px;
}
#char-friend-toolbar-button {
  margin-left: 10px;
  margin-right: 15px;
}
#char-friend-list {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.char-friend-list-item {
  cursor: default;
  flex: 0 0 40px;
  padding: 10px 15px 10px 15px;
  .username {
    margin: 3px;
    padding: 0;
    font-size: 120%;
    display: inline-block;
    color: #606266;
  }
  .time {
    margin: 0;
    padding: 0;
    font-size: 80%;
    float: right;
    color: #909399;
  }
  .content {
    margin: 0;
    padding: 0;
    font-size: 80%;
    margin-top: 5px;
    color: #909399;
  }
}
.char-friend-list-item:hover {
  background-color: #DEDEDE;
}
#chat-window {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}
#chat-window-title {
  flex: 0 0 auto;
  .username {
    margin: 15px 15px 15px 15px;
    padding: 0px;
    font-size: 120%;
    color: #606266;
    text-align: center;
  }
  border-bottom: 1px #E8E8E8 solid;
}
#chat-window-up {
  flex: 1 1 auto;
  overflow-y: auto;
}
#chat-window-down {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-top: 1px #E8E8E8 solid;
}
#chat-window-down-button {
  margin: 5px;
}
</style>
