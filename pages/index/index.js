var app = getApp();

var userId = 100;

Page({
    data:{
        motto: 'Hello Foolish WeChat App',
        userInfo:{}
    },

    bindViewTap: function(){
        wx.navigateTo({
          url: '../chat/chat'
        })
    },

    findPartner: function(){
        userId++;
        wx.request({
          url: app.globalData.ip + '/match/'+ userId +'/female',
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            console.log(res);
          },
          fail: function() {
            console.log('failed')
          },
          complete: function() {
            console.log('complete')
          }
        })
    },

    getAnother: function(){
        wx.request({
          url: app.globalData.ip+ '/getAnotherHalf/' + userId,
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            console.log(res);
          },
          fail: function() {
            console.log('failed')
          },
          complete: function() {
            console.log('complete')
          }
        })
    },

    gotoChat: function(){
        wx.navigateTo({
          url: '../chat/chat?id=2&name=haha',
        })
    },

    processRequest: function(xhr){
        if(xhr.readyState == 4 && xhr.status ==200){
            //xhr.responseText
        }else{
            //xhr.status + "" + xhr.readyState
        }
    },
    
    onLoad: function(){
        console.log('onLoad')
        var that = this
        app.getUserInfo(function(userInfo){
            that.setData({
                userInfo:userInfo
            })
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
            data: '2'
          })
        })

        //监听WebSocket接受到服务器的消息事件
        wx.onSocketMessage(function(data) {
          console.log(data)
        })

        // 监听 socket 关闭连接后的回调 
        wx.onSocketClose(function() {
          console.log('WebSocket连接已关闭！')
        })

    }
})