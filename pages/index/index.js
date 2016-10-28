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

    findParter: function(){
        //connect to server and find a partner
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