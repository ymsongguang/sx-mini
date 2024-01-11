// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    placement: 'left',
    sidebar: [],
    image: '../../images/default.jpg',
    baseSidebar: [
      {
        title: '蛟哥哥',
      },
      {
        title: '蛟哥哥2',
      },
      {
        title: '蛟哥哥3',
      },
      {
        title: '盖亚！',
      },
      {
        title: '盖亚！！',
      },
      {
        title: '盖亚！！！',
      },
      {
        title: '难受！',
      },
      {
        title: '菜单八',
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openDrawerBase() {
      this.setData({
        visible: true,
        sidebar: this.data.baseSidebar
      });
    },

    itemClick(e) {
      console.log(e.detail);
    },

    overlayClick(e) {
      console.log(e.detail);
    },
  },
});
