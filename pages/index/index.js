var app = getApp()
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
        wx.request({
          url: 'http://192.168.1.108:8000',
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
        // console.log('find partner called!');
        // var xhr = new XMLHttpRequest();
        // xhr.open('GET','http://192.168.1.108:8000',true);
        // xhr.send(null);
        // xhr.addEventListener('readystatechange',processRequest(xhr),false)
        //connect to server and find a partner
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