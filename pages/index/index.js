// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Component({
  data: {
    cryptoList: [], // 存储获取到的加密货币列表
    keyword: '', // 搜索关键词
    loading: false, // 加载状态
    error: null, // 错误信息
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function() {
      this.fetchData();
    },
    fetchData: function() {
      const that = this;
      wx.request({
        url: 'http://47.108.164.54:8668/account/cryptoList',
        method: 'POST',
        success(res) {
          if (res.statusCode === 200) {
            that.setData({ cryptoList: res.data });
          } else {
            console.error('Failed to fetch crypto list:', res);
          }
        },
        fail(error) {
          console.error('Request failed:', error);
        }
      });
    },
    // 复制按钮
    copyToClipboard(e) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.cryptoList[index];
      wx.setClipboardData({
        data: item.mint,
        success() {
          wx.showToast({
            title: '已复制',
            icon: 'success'
          });
        }
      });
    },
    // 输入框变化时更新keyword
    handleInput(e) {
      this.setData({
        keyword: e.detail.value,
      });
    },
    // 搜索按钮点击事件处理函数
  handleSearch() {
    const { keyword } = this.data;
    this.setData({ loading: true, error: null });
    // 发起POST请求
    wx.request({
      url: 'http://47.108.164.54:8668/account/cryptoList',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      data: JSON.stringify({ keyword }), // 将对象转换为JSON字符串
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            dataList: res.data.data || [],
            loading: false,
          });
        } else {
          this.setData({
            loading: false,
            error: res.data.message || '未知错误',
          });
          wx.showToast({
            title: res.data.message || '查询失败',
            icon: 'none',
          });
        }
      },
      fail: () => {
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
  },

   /**
   * 组件的属性列表
   */
  properties: {

  },
});
