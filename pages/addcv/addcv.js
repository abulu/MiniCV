//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //添加新简历数据
    isUserSaved: false,
    isShowViewSection: true,
    isShowEditSection: true,
    uname: wx.getStorageSync('UserName'),
    usubname: wx.getStorageSync('UserSubName'),
    fdate: "开始时间",
    edate: "结束时间",
    cvdesc: "",
    //简历数据列表
    myCVArray: [
      { fromdate: '2008年', todate: '2013年', cvdesc: '从学校毕业，加入NCS。先后工作与成都，苏州，新加坡。工作服务于citibank，澳洲房管局，新加坡学校，外交部项目。' },
      { fromdate: '2013年7月', todate: '2013年9月', cvdesc: '从NCS离职后，5月骑行318线，在7月的时候面试加入vancl。工作于仓储组。后搭建电商同意平台。' },
      { fromdate: '2013年10月', todate: '2014年8月', cvdesc: '加入重庆微软公司，在培训学习一个月后，进入微软上海医疗项目组。为上海五官科医院工作，开发小医技系统。' },
      { fromdate: '2014年9月', todate: '现在', cvdesc: '加入ANZ，为银行内部项目维护与升级服务。工作于asp.net与sharepoint平台。目前也在开发前段项目，改变ANZ项目中UI普遍老化的情况。' }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //获取存储在本地的简历信息
    try {
      var value3 = wx.getStorageSync('MyCVList')
      if (value3) {
        //console.log(value);
        //Do something with return value
        this.setData({ myCVArray: value3 })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //事件处理 - 控制section显示与隐藏
  showViewPart: function (e) {
    this.setData({ isShowViewSection: !this.data.isShowViewSection });

  },
  showEditPart: function (e) {
    this.setData({ isShowEditSection: !this.data.isShowEditSection });

  },
  //事件处理 - 删除简历项
  cleanCVItem: function (e) {
    var dataid = e.currentTarget.dataset.id;
    console.log(dataid);
    var myCV = this.data.myCVArray
    myCV.splice(dataid, 1);
    this.setData({ myCVArray: myCV });
    //保存微简历数据
    wx.setStorageSync('MyCVList', this.data.myCVArray)

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now().toString() + ' 删除一条简历信息')
    wx.setStorageSync('logs', logs)

  },


  //事件处理 - 修改名字及添加新的人生历程 

  bindNameChange: function (e) { this.setData({ isUserSaved: false, uname: e.detail.value }) },
  bindSubNameChange: function (e) { this.setData({ isUserSaved: false, usubname: e.detail.value }) },
  bindDateChangeFrom: function (e) { this.setData({ fdate: e.detail.value }) },
  bindDateChangeEnd: function (e) { this.setData({ edate: e.detail.value }) },
  bindKeyInputDesc: function (e) { this.setData({ cvdesc: e.detail.value }) },

  //事件处理 - 处理保存用户信息
  saveuserprofile: function (e) {
    wx.setStorageSync('UserName', this.data.uname)
    wx.setStorageSync('UserSubName', this.data.usubname)

    this.setData({ isUserSaved: true })
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now().toString() + ' 保存用户信息')
    wx.setStorageSync('logs', logs)
  },
  //事件处理 - 处理保存输入信息
  saveinput: function (e) {
    try {


      // console.log(this.data.fdate);
      // console.log(this.data.edate);
      // console.log(this.data.cvdesc);

      this.data.myCVArray.push({ fromdate: this.data.fdate, todate: this.data.edate, cvdesc: this.data.cvdesc, viewclass: 'cv-view-color5' });

      this.setData({ myCVArray: this.data.myCVArray })

      //保存微简历数据
      wx.setStorageSync('MyCVList', this.data.myCVArray)
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now().toString() + ' 添加一条简历信息')
      wx.setStorageSync('logs', logs)
    } catch (e) {
    }
  }
})
