var app = getApp();
var userId;

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
          duration:60000
        });

        var gender = _self.data.userInfo.gender == 1 ? 'male':'female';
        app.globalData.mineId = Math.floor(Math.random()*1000);
        userId = app.globalData.mineId;
        var _url = app.globalData.ip + '/match/'+ userId + '/' + gender;
        console.log(_url);

        wx.request({
          url: _url,
          data: {},
          method: 'GET',
          success: function(res){
            //request mathing succeeded, keep asking the server whom we got
            console.log(res);

            if(res.data == null || res.data == "null"){
              startPolling();
            }else{
              app.globalData.partnerId = res.data['id'];
              wx.hideToast();
              gotoChat();
            }
          }
        })

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
          wx.showToast({
            title:'正在匹配中',
            icon:'loading',
            duration:60000
          });
          pollCount++;
          console.log('tried time = ' + pollCount)
          var _url = app.globalData.ip+ '/getAnotherHalf/' + userId;
          wx.request({
            url: _url,
            data: {},
            method: 'GET',
            success: function(res){
              console.log('polling success'  + res.data);
              // res.data = "success";
              if(res.data == "null"){
                console.log('failed to find partner!')
                //failed to get a partner, try again after 1s
                setTimeout(startPolling,1000);                  
              }else{
                //find a partner successfully,go chating!
                app.globalData.partnerId = res.data;
                console.log('find a partner: ' + res.data);
                wx.hideToast();
                gotoChat();
              }
            }
          })
        }
      }

    },

    getAnother: function(){
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
            console.log(userInfo);
            that.setData({
                userInfo:userInfo
                
            })
        })
    }
})
