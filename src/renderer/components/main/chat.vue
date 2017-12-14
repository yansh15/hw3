<template>
  <div id="chat-page">
    <div id="chat-friend">
      <div id="char-friend-toolbar">
        <div id="char-friend-toolbar-input">
          <el-input placeholder="搜索" size="mini" suffix-icon="el-icon-search" v-model="filterText"></el-input>
        </div>
        <div id="char-friend-toolbar-button">
          <el-button size="mini" icon="el-icon-plus"></el-button>
        </div>
      </div>
      <div id="char-friend-list">
        <div class="char-friend-list-item" v-for="(item, index) in friendList" :key="index">
          <p class="username">{{item.username}}</p>
          <el-badge :value="item.news" :max="99"></el-badge>
          <p class="time">{{getLastMessageTime(item)}}</p>
          <p class="content">{{getLastMessageContent(item)}}</p>
        </div>
      </div>
    </div>
    <div id="chat-window" v-if="curFriend !== null">
      <div id="chat-window-up">
      </div>
      <div id="chat-window-down">
        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="sendText"></el-input>
        <el-button id="chat-window-down-button" size="mini" type="success" :plain="true">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../util/index'
export default {
  name: 'chat',
  data () {
    return {
      curFriend: this.$store.state.user.friends[0],
      filterText: '',
      sendText: ''
    }
  },
  computed: {
    friendList () {
      return this.$store.state.user.friends
    }
  },
  methods: {
    getLastMessageTime (friend) {
      return util.getTimeStringFromSeconds(friend.messages[friend.messages.length - 1].time)
    },
    getLastMessageContent (friend) {
      return friend.messages[friend.messages.length - 1].content
    }
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
  flex: 0 0 40px;
  margin: 10px 15px 10px 15px;
  .username {
    margin: 0;
    padding: 0;
    font-size: 120%;
    display: inline-block;
  }
  .time {
    margin: 0;
    padding: 0;
    font-size: 80%;
    float: right;
  }
  .content {
    margin: 0;
    padding: 0;
    font-size: 80%;
    margin-top: 5px;
  }
}
#chat-window {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}
#chat-window-up {
  flex: 1 1 auto;
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
