var app = getApp();

Page({

    data:{
        motto: 'Hello Foolish WeChat App',
        userInfo:{},  //wechat userinfo
        isEnterChatHidden:false,
    },

    getRandomTitle:function(){
            var titles = [
              "正在充Q币",
              "正在买通后台程序员",
              "正在寻找漂亮美眉",
              "正在购买装逼道具",
              "正在喷洒香水",
              "正在穿上性感内衣",
              "正在联系张小龙",
              "正在删除前任联系方式",
              "正在复习撩妹课程",
              "正在积聚洪荒之力",
              "正在预定快捷酒店"
            ];
            var index = Math.floor(Math.random()* titles.length)
            return titles[index];
    },

    needStop : false,

    showFunnyToast: function(){
      var _self = this;
            wx.showToast({
                title:_self.getRandomTitle(),
                icon:'loading',
                duration:5000
                
              });
            if(!_self.needStop){
              setTimeout(function(){
                wx.hideToast();
                _self.showFunnyToast();
              },5000);
            }
    },

    findPartner: function(){
      var _self = this;

      this.showFunnyToast();
        
        var gender = _self.data.userInfo.gender == 1 ? 'male':'female';
        app.globalData.mineId = Math.floor(Math.random()*1000);
        var userId = app.globalData.rrUserInfo.userId;
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
              needStop = true;
              app.globalData.rrUserInfo.partnerId = res.data['id'];
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
          needStop = true;
          wx.hideToast();
        }else{
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
            that.data.userInfo = userInfo
            getUserId();
        })

        function getUserId(){
          var _url = app.globalData.ip+ '/getUserId/' + getUniqueString(that.data.userInfo.avatarUrl);
          console.log(_url);
          wx.request({
            url: _url,
            data: {},
            method: 'GET',
            success: function(res){
              console.log(res.data);
              app.globalData.rrUserInfo.userId = res.data
              getUserInfo();
              // success
            }
          })
        }
        //generate a unique id according to user avatarUrl
        function getUniqueString(avatarUrl){
          var index = avatarUrl.lastIndexOf('/');
          return avatarUrl.substring(index-40,index);
        }

        function getUserInfo(){
          var _url = app.globalData.ip+ '/getUserInfo/' + app.globalData.rrUserInfo.userId;
          console.log(_url);
          wx.request({
            url: _url,
            data: {},
            method: 'GET',
            success: function(res){
              console.log(res.data);
              app.globalData.rrUserInfo.status = res.data.status;
              if(res.data.status == -1){
                that.data.isEnterChatHidden = false;
              }else if(res.data.status == 0){
                that.data.isEnterChatHidden = false;
                that.showFunnyToast();
              }else if(res.data.status ==1){
                that.data.isEnterChatHidden = true;
              }
              // success
            }
          })
        }


    }
})
