var app = getApp();

var userId = 100;

Page({

    data:{
        motto: 'Hello Foolish WeChat App',
        userInfo:{}
    },

    findPartner: function(){
      var _self = this;
        wx.showToast({
          title:'正在匹配中',
          icon:'loading',
          duration:600000
        });

       var gotoChat = function (res){
            wx.navigateTo({
              url: '../chat/chat?name='+'haha',
            });
        };

        var pollCount = 0;
        var startPolling = function(){
          if(pollCount > 60){
            //tried 60 times and failed
            wx.hideToast();
          }else{
            pollCount++;
            wx.request({
              url: app.globalData.ip+ '/getAnotherHalf/' + userId,
              data: {},
              method: 'GET',
              success: function(res){
                //find a partner successfully,go chating!
                wx.hideToast();
                console.log(res);
                gotoChat();
              },
              fail: function() {
                //failed to get a partner, try again after 1s
                setTimeout(startPolling,1000);
              }
            })
          }
        }

        var partnerGender = _self.data.userInfo.gender == 1? 'femal':'male';
        var _url = app.globalData.ip + '/match/'+ _self.data.userInfo.nickName + '/' + partnerGender;
        console.log(_url);
        
        wx.request({
          url: _url,
          data: {},
          method: 'GET',
          success: function(res){
            //request mathing succeeded, keep asking the server whom we got
            console.log(res);
            startPolling();
          },
          fail: function() {
            console.log('findPartner failed')
          },
          complete: function() {
            console.log('findPartner complete')
          }
        })
    },

    getAnother: function(){
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
            data: '1'
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
