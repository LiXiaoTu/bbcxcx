var util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hotPcc: [],
    donateView:''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    that.setData({
      donateView:wx.getStorageSync({
        key: 'donateView'
      })
    })
    util.getPromise({'oid': wx.getStorageSync('oid'), 'userID': wx.getStorageSync('userID')}, 'services/getDonateSuccessLists').then(res => {
      wx.removeStorageSync('oid');
      wx.removeStorageSync('allMoney');
      that.setData({
        hotPcc: res
      })
    })
  },
  // imageError: function (e) {
  //   var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
  //   var imgObject = "hotPcc.data[" + errorImgIndex + "].imageUrl" //carlistData为数据源，对象数组
  //   var errorImg = {}
  //   errorImg[imgObject] = "https://staticcdn2.zhongtuobang.com/img/error_empImag_60x80.gif" //我们构建一个对象
  //   this.setData(errorImg) //修改数据源对应的数据
  // },
})