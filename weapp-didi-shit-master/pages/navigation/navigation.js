var QQMapWX = require('../../qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');

var qqmapsdk = new QQMapWX({
  key: 'A2DBZ-KZA6F-RFKJC-N2LOE-CV222-7UF4G' // 必填
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    longitude:0,
    latitude:0,
    markers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('nav' + options.lat)
    const system = wx.getSystemInfoSync()
    this.setData({
      height: system.windowHeight
    })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
      }
    })

    var mks = []
    mks.push({ // 获取返回结果，放到mks数组中
      title: options.address,
      // id: res.data[i].id,
      latitude: options.lat,
      longitude: options.lng,
      iconPath: "/images/matong.png", //图标路径
      width: 30,
      height: 30,
    })
    this.setData({ //设置markers属性，将搜索结果显示在地图中
      markers: mks
    })


    var _this = this;
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      to: options.lat + ',' + options.lng,
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF9933',
            width: 8
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  onShareAppMessage: function (res) {
    return {
      title: "💩 滴滴拉屎",
      path: '/page/index/index',
      imageUrl: '/images/sharebg.jpg'
    }
  }
})