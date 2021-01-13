<template>
  <div class="speak-bottom-wrapper" v-show="bottomTabVisible">
    <div class="speak-bottom-icon-wrapper">
      <div class="icon-play_go" v-show="currentStatus===1" @click="playGo"></div>
      <div class="icon-play_pause" v-show="currentStatus===2" @click="playPause"></div>
    </div>
    <div class="speak-bottom-info-wrapper">
      <div class="speak-bottom-info-section">
        <span>{{`${currentSectionText}(${currentSectionIndex}/${currentSectionTotal})`}}</span>
      </div>
      <div class="speak-bottom-info-time">
        <span>{{`${currentMinute} : ${currentSecond} / ${durationMinute} : ${durationSecond}`}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bottomTabVisible: {
      type: Boolean,
      default: false
    },
    currentSectionText: String,
    currentStatus: Number,
    currentSectionTotal: Number,
    currentSectionIndex: Number,
    playCurrentTime: Number,
    playDuration: Number
  },
  methods: {
    playGo() {
      this.$emit('playGo');
    },
    playPause() {
      this.$emit('playPause');
    }
  },
  computed: {
    currentSecond() {
      const second = Math.floor(this.playCurrentTime % 60);
      if (second < 10) {
        return '0' + second;
      } else {
        return second + '';
      }
    },

    currentMinute() {
      if (this.playCurrentTime) {
        const minte = Math.floor(this.playCurrentTime / 60);
        if (minte < 10) {
          return '0' + minte;
        } else {
          return minte + '';
        }
      } else {
        return '00';
      }
    },
    durationSecond() {
      if (this.playDuration) {
        const second = Math.floor(this.playDuration % 60);
        if (second < 10) {
          return '0' + second;
        } else {
          return second + '';
        }
      } else {
        return '00';
      }
    },
    durationMinute() {
      if (this.playDuration) {
        const minte = Math.floor(this.playDuration / 60);
        if (minte < 10) {
          return '0' + minte;
        } else {
          return minte + '';
        }
      } else {
        return '00';
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.speak-bottom-wrapper {
  position: absolute;
  left: 0;
  bottom: px2rem(40);
  padding: px2rem(10);
  box-sizing: border-box;
  display: flex;
  background: white;
  width: 100%;
  border-bottom: 1px solid rgba(179, 179, 179, 0.548);
  box-shadow: 0 px2rem(-4) px2rem(4) rgba(201, 201, 201, 0.342);
  .speak-bottom-icon-wrapper {
    flex: 0 0 px2rem(50);
    color: rgb(0, 119, 255);
    .icon-play_go {
    }
    .icon-play_pause {
    }
  }
  .speak-bottom-info-wrapper {
    font-size: px2rem(14);
    width: 80%;
    .speak-bottom-info-section {
      line-height: px2rem(16);
      @include ellipsis;
    }
    .speak-bottom-info-time {
      margin-top: px2rem(6);
      font-size: px2rem(10);
    }
  }
}
</style>
