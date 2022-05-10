<template>
  <div id="app">
    <router-view></router-view>
    <editpassword></editpassword>
  </div>
</template>
<script>
import Vue from "vue";
import Notification from "@/components/Notification";
import Editpassword from "@/components/EditPassword";
export default {
  name: "app",
  data() {
    return {
      websock: null, //建立的连接
      lockReconnect: false, //是否真正建立连接
      timeout: 28 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
      lastRunTime: Date.now(), //上次播放声音的时间
    };
  },
  components: {
    Notification,
    Editpassword,
  },
  created() {
    // this.initWebSocket();
  },

  methods: {
    initWebSocket() {
      //建立连接
      //初始化weosocket
      //建立连接
      this.websock = new WebSocket("ws://junr.mynatapp.cc/websocket");
      //连接成功
      this.websock.onopen = this.websocketonopen;
      //连接错误
      this.websock.onerror = this.websocketonerror;
      //接收信息
      this.websock.onmessage = this.websocketonmessage;
      //连接关闭
      this.websock.onclose = this.websocketclose;
    },
    reconnect() {
      //重新连接
      var that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        //新连接
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
    },
    reset() {
      //重置心跳
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.start();
    },
    start() {
      //开启心跳
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      self.timeoutObj = setTimeout(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState == 1) {
          //如果连接正常
          self.websock.send(
            JSON.stringify({
              msg_type: "heart",
            })
          );
        } else {
          //否则重连
          self.reconnect();
        }
        self.serverTimeoutObj = setTimeout(function () {
          //超时关闭
          self.websock.close();
        }, self.timeout);
      }, self.timeout);
    },
    websocketonopen() {
      //连接成功事件
      console.log("连接成功");
      //开启心跳
      this.start();
    },
    websocketonerror(e) {
      //连接失败事件
      //错误
      console.log("WebSocket连接发生错误");
      //错误提示
      console.log("Websocket error, Check you internet!");
      //重连
      this.reconnect();
    },
    websocketclose(e) {
      //关闭
      console.log("connection closed (" + e.code + ")");
      //提示关闭
      console.log("连接已关闭");
      //重连
      this.reconnect();
    },
    async websocketonmessage(event) {
      //接收服务器推送的信息
      //打印收到服务器的内容
      var _data = await this.$tools.parseBlob(event.data);
      var _resJson = JSON.parse(_data);
      if (_resJson.code === 1) {
        var message =
          _resJson.data.type === 2
            ? "你有新的订单请及时处理!"
            : "你有新的消息请及时查看";
        this.$store.dispatch("setMsg", {
          isMsg: true,
          type: _data.type,
        });
        this.$store.dispatch("getNotification", true);
        this.$notify({
          title: "消息提醒",
          message: message,
          type: "success",
        });
      }
      //收到服务器信息，心跳重置
      this.reset();
    },
    websocketsend(msg) {
      //向服务器发送信息
      //数据发送
      this.websock.send(JSON.stringify(msg));
    },
  },
};
</script>
