//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    address: '',
    distance: '',
    title:'',
    lat:'',
    lng:'',
  },
  onLoad: function (options) {
    console.log('logs'+options.lat+options.lng)
    this.setData({
      address: options.address,
      distance: options.distance+'米',
      title: options.title,
      lat:options.lat,
      lng:options.lng
    })
  },


  goshit() {
    wx.navigateTo({
      url: '../navigation/navigation?lat=' + this.data.lat + '&lng=' + this.data.lng + '&address' + this.data.address
    })
    return
    // wx.showModal({
    //   title: '厕所地址',
    //   content: mark.address+' ('+mark._distance.toFixed(0)+'m)',
    //   showCancel: false,
    //   success: function(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // })
  },

  onShareAppMessage: function (res) {
    return {
      title: "💩 滴滴拉屎",
      path: '/page/index/index',
      imageUrl: '/images/sharebg.jpg'
    }
  }
})
