var app = getApp();
var timerId;

Page({

    data:{
        motto: 'Hello Foolish WeChat App',
        userInfo:{},  //wechat userinfo
        isEnterChatHidden:false,
    },

    // 返回随机生成的字符串
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
          this.timerId = setTimeout(function(){
            wx.hideToast();
            _self.showFunnyToast();
          },5000);
        }
    },

    onMathClicked : function(){
      var _self = this;
      if(app.globalData.rrUserInfo.status == 0){
          wx.showToast({
            title:'正在匹配中，请稍后',
            icon:'loading',
            duration:3000
          });
      }else if (app.globalData.rrUserInfo.status == -1){
        this.findPartner();
      }else{
        wx.showModal({
          title:'提示',
          content:'你现在已经有聊天对象，重新匹配将解除之前的关系，是否继续？',
          success:function(res){
            if(res.confirm){
              _self.endChat(true);
            }
          }
        });
      }
    },

    endChat : function(shouldFindAnother){
      var _self = this;
      var userId = app.globalData.rrUserInfo.userId;
      var _url = app.globalData.ip + '/endChat/'+ userId + '/' + gender;      
      wx.request({
        url: _url,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          if(shouldFindAnother){
            _self.findPartner;
          }
          // success
        }
      })
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
            app.globalData.rrUserInfo.partnerId = res.data['id'];
            app.globalData.rrUserInfo.partnerAvatarUrl = res.data['avatarUrl'];
            wx.hideToast();
            _self.gotoChat();
          }
        }
      })

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
              if(res.data == "null"){
                console.log('failed to find partner!')
                //failed to get a partner, try again after 1s
                setTimeout(startPolling,1000);                  
              }else{
                //find a partner successfully,go chating!
                app.globalData.rrUserInfo.partnerId = res.data['id'];
                app.globalData.rrUserInfo.partnerAvatarUrl = res.data['avatarUrl'];
                console.log('find a partner: ' + res.data);
                wx.hideToast();
                _self.gotoChat();
              }
            }
          })
        }
      }

    },

    getRandomNickname:function(){
            var nicknames = [
              "花心射手座",
              "执着摩羯座",
              "激情天蝎座",
              "性感双子座",
              "暖暖白羊座",
              "挑剔处女座",
              "气质天枰座",
              "倔强金牛座",
              "善变巨蟹座",
              "傲娇狮子座",
              "童心水瓶座",
              "无为双鱼座" 
            ];
            var index = Math.floor(Math.random()* nicknames.length)
            return nicknames[index];
    },
    gotoChat : function (res){
            this.needStop = true;
            clearTimeout(this.timerId);
            wx.navigateTo({
              url: '../chat/chat?name='+ this.getRandomNickname(),
            });
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
            // that.data.userInfo = userInfo
            getUserId();
        })

        function getUserId(){
//          var _url = app.globalData.ip+ '/getUserId/' + getUniqueString(that.data.userInfo.avatarUrl);
          var _url = app.globalData.ip+ '/getUserId/';

          console.log(_url);
          wx.request({
            url: _url,
            data: {avatarUrl:that.data.userInfo.avatarUrl},
//            data: {},
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
          var data = {};
          data.avatarUrl = avatarUrl;
          return JSON.stringify(data); 
          // var index = avatarUrl.lastIndexOf('/');
          // return avatarUrl.substring(index-40,index);
//          return avatarUrl;
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
              var tt = {};
              tt.userInfo = that.data.userInfo;
              if(res.data.status == -1){
                tt.isEnterChatHidden = true;
              }else if(res.data.status == 0){
                tt.isEnterChatHidden = false;
                that.showFunnyToast();
              }else if(res.data.status ==1){
                tt.isEnterChatHidden = false;
              }
              that.setData(tt);
              // success
            }
          })
        }

    }
})
