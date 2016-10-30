var app = getApp();

var userId = 0;

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
          url: 'http://192.168.1.108:4000/match/'+ userId +'/male',
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
          url: 'http://192.168.1.108:4000/getAnotherHalf/' + userId,
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
    }
})