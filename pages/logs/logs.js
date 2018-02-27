//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        //return util.formatTime(new Date(log))
       var strdate =  log.substring(0, 13)
//return strdate
       return util.formatTime(new Date(parseInt(strdate))) +  log.substring( 13)
 
       // return  util.formatTime(new Date(log.substring(0,13)));
        //return log
      })
    })
  }
})
