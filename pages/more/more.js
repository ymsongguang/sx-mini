// pages/more/more.js
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
    tmplIds: ['poCz5BalfIqta8w_O9mpq31ar5-7YSVixmTs3IzpYsI'], // 替换为实际的模板ID
    userRemark: '', // 搜索关键词
    walletList: [], // 钱包列表
    loading: false, // 加载状态
    error: null, // 错误信息
    page: 1, // 当前页码
    pageSize: 500, // 每页大小
    hasMore: true, // 是否有更多数据
    userAddr: '', // 用户输入的钱包地址
    userRemark: '', // 用户输入的备注
  },
  /**
   * 组件的方法列表
   */
  methods: {
      // 订阅消息的方法
  subscribeMessage() {
    const that = this;
    wx.requestSubscribeMessage({
      tmplIds: that.data.tmplIds,
      success(res) {
        console.log('用户同意订阅', res);
        for (let id in res) {
          if (res[id] === 'accept') {
            // 用户同意订阅此id的消息
            console.log(`用户同意订阅消息 ${id}`);
          } else if (res[id] === 'ban') {
            // 用户拒绝订阅，或被系统禁止
            console.error(`用户拒绝订阅消息 ${id} 或被系统禁止`);
          }
        }
      },
      fail(err) {
        console.error('订阅消息失败', err);
      }
    });
  },
  onLoad() {
    this.loadWalletList();
  },
  // 加载钱包列表
  loadWalletList(userRemark = '') {
    const { page, pageSize } = this.data;

    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: 'http://47.108.164.54:8668/account/WalletList',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      data: JSON.stringify({ userRemark, page, pageSize }),
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          const newData = res.data.records || [];
          const newWalletList = userRemark ? newData : this.data.walletList.concat(newData);
          this.setData({
            walletList: newWalletList,
            hasMore: newData.length >= pageSize,
            loading: false,
          });
        } else {
          this.setData({
            loading: false,
            error: res.data.message || '未知错误',
          });
          wx.showToast({
            title: res.data.message || '加载失败',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        this.setData({
          loading: false,
          error: '网络请求失败，请稍后再试。',
        });
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      },
    });
  },

  // 处理输入框变化
  handleInput(e) {
    this.setData({
      userRemark: e.detail.value,
    });
  },

  // 搜索按钮点击事件处理函数
  handleSearch() {
    const { userRemark } = this.data;

    this.setData({
      page: 1,
      walletList: [],
      hasMore: true,
    });

    this.loadWalletList(userRemark);
  },

  // 下拉滚动翻页
  onReachBottom() {
    console.log(!this.data.hasMore);
    console.log(!this.data.hasMore);
    if (!this.data.hasMore || this.data.loading) return;

    this.setData({
      page: this.data.page + 1,
      loading: true,
    });

    this.loadWalletList(this.data.userRemark);
  },

  // 删除钱包
  handleDelete(e) {
    console.log(e, "删除");
    const code = e.currentTarget.dataset.useraddr;
    if (!code) {
      wx.showToast({
        title: '无效的钱包地址',
        icon: 'none',
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除该钱包吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'http://47.108.164.54:8668/account/deleteWallet',
            method: 'POST',
            header: {
              'content-type': 'application/json', // 默认值
            },
            data: `${encodeURIComponent(code)}`,
            success: (res) => {
              if (res.statusCode === 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 3000,
                });
               // 清空当前列表并重新加载
                this.setData({
                  walletList: [],
                  page: 1,
                  hasMore: true,
                });
                this.loadWalletList(); // 刷新列表
              } else {
                wx.showToast({
                  title: res.data.message || '删除失败',
                  icon: 'none',
                });
              }
            },
            fail: () => {
              wx.showToast({
                title: '网络请求失败',
                icon: 'none',
              });
            },
          });
        }
      },
    });
  },
  // 处理钱包地址输入变化
  handleUserAddrInput(e) {
    this.setData({
      userAddr: e.detail.value,
    });
  },

  // 处理备注输入变化
  handleUserRemarkInput(e) {
    this.setData({
      userRemark: e.detail.value,
    });
  },
  // 新增提交
  handleSubmit() {
    const { userAddr, userRemark } = this.data;
    if (!userAddr.trim()) {
      wx.showToast({
        title: '请输入钱包地址',
        icon: 'none',
      });
      return;
    }

    wx.request({
      url: 'http://47.108.164.54:8668/account/insertWallet',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      data: JSON.stringify({ userAddr, userRemark }),
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
          });
          // 清空当前列表并重新加载
          this.setData({
            walletList: [],
            page: 1,
            hasMore: true,
          });
          this.loadWalletList(); // 刷新列表
        } else {
          wx.showToast({
            title: res.data.message || '提交失败',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      },
    });
  },

  // 停止任务
  handleStopTask() {
    wx.request({
      url: 'http://47.108.164.54:8668/account/close',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: res.data.message || '任务已停止',
            icon: 'success',
          });
        } else {
          wx.showToast({
            title: res.data.message || '停止任务失败',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      },
    });
  },

  // 开始任务
  handleStartTask() {
    wx.request({
      url: 'http://47.108.164.54:8668/account/start',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: res.data.message || '任务已开始',
            icon: 'success',
          });
        } else {
          wx.showToast({
            title: res.data.message || '开始任务失败',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      },
    });
  },

  }
})