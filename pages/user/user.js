// pages/user/user.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    openId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(e) {
      console.log('用户信息:', e.detail);
  
      if (e.detail.userInfo) {
        // 用户按了允许授权按钮
        wx.login({
          success: res => {
            if (res.code) {
              // 发起网络请求到自己的服务器
              console.log("code: " + res.code)
              wx.request({
                url: 'http://47.108.164.54:8668/account/getOpenId', // 替换为你的服务器地址
                data: `${encodeURIComponent(res.code)}`,
                method: 'POST',
                success: function(res) {
                  console.log('Server response:', res.data);
                  if (res.data && res.data === "登录成功") {
                    this.setData({
                      openId: res.data
                    });
                  }
                }.bind(this),
                fail: function(err) {
                  console.error('Error fetching OpenID:', err);
                }
              });
            } else {
              console.log('登录失败！' + res.errMsg);
            }
          }
        });
      } else {
        // 用户按了拒绝按钮
        console.log('用户拒绝授权');
      }
    }
  }
})