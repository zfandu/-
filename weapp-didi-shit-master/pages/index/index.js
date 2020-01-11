var QQMapWX = require('../../qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');

var qqmapsdk = new QQMapWX({
  key: 'A2DBZ-KZA6F-RFKJC-N2LOE-CV222-7UF4G' // 必填
});

Page({
  data: {
    height: 0,
    center: [],
    markers: []
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e)
    let mark = {}
    this.data.markers.map((ele)=>{
      if(ele.id == e.markerId)
        mark = ele
    })
    console.log(mark)
    wx.navigateTo({
      url: '../logs/logs?lat=' + mark.latitude + '&lng=' + mark.longitude + '&address=' + mark.address + '&distance=' + mark.distance+'&title='+mark.title
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



  onLoad() {
    const system = wx.getSystemInfoSync()
    this.setData({
      height: system.windowHeight
    })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        // console.log(JSON.stringify(res))

        this.setData({
          center: [res.longitude, res.latitude]
        })

        var _this = this;
        // 调用接口
        qqmapsdk.search({
          keyword: '厕所',  //搜索关键词
          location: _this.data.center[1] + ',' + _this.data.center[0],  //设置周边搜索中心点
          success: function (res) { //搜索成功后的回调
            var mks = []
            for (var i = 0; i < res.data.length; i++) {
              mks.push({ // 获取返回结果，放到mks数组中
                title: res.data[i].title,
                id: res.data[i].id,
                latitude: res.data[i].location.lat,
                longitude: res.data[i].location.lng,
                iconPath: "/images/matong.png", //图标路径
                width: 30,
                height: 30,
                address:res.data[i].address,
                distance: res.data[i]._distance
              })
            }
            _this.setData({ //设置markers属性，将搜索结果显示在地图中
              markers: mks
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    })
  },

  onShareAppMessage: function (res) {
    return {
      title: "💩 滴滴拉屎",
      path: '/page/index/index',
      imageUrl: '/images/sharebg.jpg'
    }
  }
})
