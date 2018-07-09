// pages/pccOrder/index.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    donateView: "",
    orderID: 0,
    allMoney: 0,
    comment: '',
    receiveName: '',
    mobile: '',
    address: '',
    orderDetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this;

    wx.setStorageSync('oid', options.oid);
    wx.setStorageSync('allMoney', options.m);
    wx.setStorageSync('donateView', options.guid);

    this.setData({
      donateView: options.guid,
      orderID: options.oid,
      allMoney: options.m
    })

    util.postPromise({
      'guid': this.data.donateView,
      'oid': this.data.orderID,
      'allMoney': this.data.allMoney,
      'userID': wx.getStorageSync('userID')
    }, 'services/orderView').then(res => {

      console.log(res)

      that.setData({
        orderDetail: res.data,
        reciveName: res.data.receiveName,
        mobile: res.data.mobile + '\n',
        address: res.data.address
      })
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  addComment: function(e) {
    console.log(e);
    this.setData({
      comment: e.detail.value
    })
  },
  createOrder: function() {
    if (this.validate()) {
      util.postPromise({
        'guid': this.data.donateView,
        'oid': this.data.orderID,
        'allMoney': this.data.allMoney,
        'userID': wx.getStorageSync('userID'),
        'comment':this.data.comment
      }, 'services/apiCreateComment').then(res => {
        console.log(res)
        if(res.success){
          util.postPromise({
            'orderNo': res.data.orderNo,
            'allMoney': res.data.money,
            'openid':wx.getStorageSync('openid')
          }, 'services/getJsApiForWxXcxPayment').then(res => {
            console.log(res)
            var paymentData = JSON.parse(res.data);
            if (res === undefined) {
              wx.showToast({
                title: '支付失败，请稍后再试！',
                icon: 'none',
                success: function () {
                  wx.removeStorageSync('oid');
                  wx.removeStorageSync('allMoney');
                  setTimeout(function(){
                    wx.redirectTo({
                      url: '../view/index?donateView=' + wx.getStorageSync('donateView'),
                    })
                  },1500);
                }
              })
            }else{
              wx.requestPayment({
                'timeStamp': paymentData.timeStamp,
                'nonceStr': paymentData.nonceStr,
                'package': paymentData.package,
                'signType': paymentData.signType,
                'paySign': paymentData.paySign,
                'success': function (res) {
                  wx.showToast({
                    title: '支付成功！',
                    icon: 'none',
                    success: function () {
                       setTimeout(function () {
                         wx.redirectTo({
                           url: '../donateSuccess/index?donateView=' + wx.getStorageSync('donateView'),
                        })
                       }, 1500);
                    }
                  })
                },
                'fail': function (res) {
                  wx.showToast({
                    title: '取消支付，请重新下单！',
                    icon: 'none',
                    success: function () {
                      wx.removeStorageSync('oid');
                      wx.removeStorageSync('allMoney');
                      setTimeout(function () {
                        wx.redirectTo({
                          url: '../view/index?donateView=' + wx.getStorageSync('donateView'),
                        })
                      }, 1500);
                    }
                  })
                }
              })

            }
          });
        }
      });
    }
  },
  //判断是否选择地址
  validate: function() {
    if (this.data.receiveName == '') {
      wx.showToast({
        title: '请完善收货地址！',
        icon: 'none',
      })
      return false;
    }
    if (this.data.mobile == '') {
      wx.showToast({
        title: '请完善收货地址！',
        icon: 'none',
      })
      return false;
    }
    if (this.data.address == '') {
      wx.showToast({
        title: '请完善收货地址！',
        icon: 'none',
      })
      return false;
    }
    return true;
  }

})