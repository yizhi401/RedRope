var app = getApp()
var getData = require('../../utils/util.js')
var textInput = ''

Page({
  data:{
    text:"这是消息页面，研发中。。。",
    title:"标题",
    userInfo: {},
    message:[],
    animation:{},
    animation_2:{},
    tap:"tapOff",
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this
    // getData.getMessage(options.id,_self)
    _self.setData({
        title:options.name
    })
    _self.setData({
        userInfo:app.globalData.userInfo
    })

    // 与服务器建立 socket 连接
    wx.connectSocket({
      url: app.globalData.wsip,
    })

    // 监听 socket 建立成功连接后的回调
    wx.onSocketOpen(function() {
      console.log('WebSocket 连接已打开！')

      // 发送当前用户的 ID 进行注册
      wx.sendSocketMessage({
        data: app.globalData.rrUserInfo.userId
      })
      console.log('注册消息已发送！')
    })

    //监听WebSocket接受到服务器的消息事件
    wx.onSocketMessage(function(res) {
      if (res.data != 'success') {
      var t = _self.data.message;
      t.push({
        img: app.globalData.rrUserInfo.partnerAvatarUrl,
        text:res.data,
        me:false
      })
      _self.setData({
        message:t
      })
      }
    })

    // 监听 socket 关闭连接后的回调
    wx.onSocketClose(function() {
      console.log('WebSocket连接已关闭！')
    })
  },

  onReady:function(){
    // 页面渲染完成
    var _self = this
    wx.setNavigationBarTitle({
      title: _self.data.title
    })
    this.animation = wx.createAnimation();
    this.animation_2 = wx.createAnimation();
  },

  sendMessage:function(message){
    console.log("sending message to server" + message)
    var display2 = {partner: app.globalData.rrUserInfo.partnerId,content:this.textInput,avatarUrl:app.globalData.rrUserInfo.partnerAvatarUrl}
    var jsondata = JSON.stringify(display2);

    console.log( JSON.stringify(display2));
    var _self = this;
    var t = _self.data.message;
    t.push({
       img:_self.data.userInfo.avatarUrl,
       text:this.textInput,
       me:true
    })
    _self.setData({
      message:t
    })

    wx.sendSocketMessage({
        data: jsondata,
        success: function(res){
          console.log("success:"+ res)
        },
        fail: function(){
            console.log("failed!")
        },
    })

  },

  bindKeyInput: function(e) {
    this.textInput = e.detail.value;
    console.log(this.textInput);
  },
  elseBtn:function(){
    var _self = this;
    if(_self.data.tap=="tapOff"){
      _self.animation_2.height("80%").step();
      _self.setData({ animation_2: _self.animation_2.export() })
      _self.setData({
           tap:"tapOn"
      })
    }else{
      _self.animation_2.height("91%").step();
      _self.setData({ animation_2: _self.animation_2.export() })
      _self.setData({
           tap:"tapOff"
      })
    }
  },

  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

})
