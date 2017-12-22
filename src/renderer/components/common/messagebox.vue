<template>
  <transition name="message-box-fade">
    <div class="message-box"  :class="[subject ? 'message-box--subject' : 'message-box--object']" role="alert">
      <div class="message-box--content">
        <p class="message-box--title">{{ time }}</p>
        <p class="message-box--description">{{ content }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'message-box',
  props: {
    time: {
      type: String,
      default: '',
      required: true
    },
    content: {
      type: String,
      default: '',
      required: true
    },
    subject: {
      type: Boolean,
      default: true,
      required: true
    }
  }
}
</script>

<style lang="scss">
.message-box {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
	width: 100%;
	padding: 8px;
  position: relative;
  overflow: hidden;
  opacity: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: opacity .2s;
  transition: opacity .2s
}

.message-box--subject {
	justify-content: flex-end;
}

.message-box--content {
  padding: 8px 16px;
  border-radius: 4px;
	display: table-cell;
	max-width: 80%;
}

.message-box--subject .message-box--content {
  background-color: #9EEA6A;
  color: #606266
}

.message-box--object .message-box--content {
  background-color: #f0f9eb;
  color: #606266
}

.message-box--title {
  font-size: 13px;
	margin: 0px;
	padding: 0px;
}

.message-box .message-box--description {
  font-size: 18px;
	margin: 5px 0px 0px 0px;
	padding: 0px;
}

.message-box-fade-enter,.message-box-fade-leave-active {
  opacity: 0
}
</style>
