<template>
  <transition name="file-box-fade">
    <div class="file-box"  :class="[subject ? 'file-box--subject' : 'file-box--object']" role="alert">
      <div class="file-box--content">
        <p class="file-box--time">{{ time }}</p>
        <p class="file-box--filename">{{ filename }}</p>
        <p class="file-box--size">{{ size }} {{subject ? '已上传' : '已下载'}} {{ fsize }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import util from '../../util/index'
export default {
  name: 'file-box',
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  computed: {
    subject () {
      return this.file.direction === 'subject'
    },
    time () {
      return util.getStringFromSeconds(this.file.time)
    },
    filename () {
      return this.file.filename
    },
    size () {
      return util.fileSizeFormat(this.file.size)
    },
    fsize () {
      return util.fileSizeFormat(this.file.fsize)
    }
  }
}
</script>

<style lang="scss">
.file-box {
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

.file-box--subject {
	justify-content: flex-end;
}

.file-box--content {
  padding: 8px 16px;
  border-radius: 4px;
	display: table-cell;
	max-width: 80%;
}

.file-box--subject .file-box--content {
  background-color: #9EEA6A;
  color: #606266
}

.file-box--object .file-box--content {
  background-color: #f0f9eb;
  color: #606266
}

.file-box--time {
  font-size: 13px;
	margin: 0px;
	padding: 0px;
}

.file-box .file-box--filename {
  font-size: 18px;
	margin: 5px 0px 0px 0px;
	padding: 0px;
}

.file-box .file-box--size {
  font-size: 14px;
	margin: 3px 0px 0px 0px;
	padding: 0px;
}

.file-box-fade-enter,.file-box-fade-leave-active {
  opacity: 0
}
</style>
