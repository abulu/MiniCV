//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    width: 300,
    height: 500,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    uname: wx.getStorageSync('UserName'),
    usubname: wx.getStorageSync('UserSubName'),
    myCVArray: [
      // { fromdate: '2008年', todate: '2013年', cvdesc: '从学校毕业，加入NCS。先后工作与成都，苏州，新加坡。工作服务于citibank，澳洲房管局，新加坡学校，外交部项目。' },
      // { fromdate: '2013年7月', todate: '2013年9月', cvdesc: '从NCS离职后，5月骑行318线，在7月的时候面试加入vancl。工作于仓储组。后搭建电商同意平台。' },
      // { fromdate: '2013年10月', todate: '2014年8月', cvdesc: '加入重庆微软公司，在培训学习一个月后，进入微软上海医疗项目组。为上海五官科医院工作，开发小医技系统。' },
      // { fromdate: '2014年9月', todate: '现在', cvdesc: '加入ANZ，为银行内部项目维护与升级服务。工作于asp.net与sharepoint平台。目前也在开发前段项目，改变ANZ项目中UI普遍老化的情况。' }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },


  onReady: function () {
    this.drawClock();
    //this.interva = setInterval(this.drawClock, 1500);
  },

  onHide: function () {
    clearInterval(this.interva)
  },
  onShow: function () {
    //获取存储在本地的简历信息
    try {
      var value = wx.getStorageSync('MyCVList')
      if (value) {
        //console.log(value);

        //Do something with return value
        this.setData({ uname: wx.getStorageSync('UserName') })
        this.setData({ usubname: wx.getStorageSync('UserSubName') })
        this.setData({ myCVArray: value })
      }
    } catch (e) {
      // Do something when catch error
    }

    this.interva = setInterval(this.drawClock, 1500);

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
      var value = wx.getStorageSync('MyCVList')
      if (value) {
        //console.log(value);

        //Do something with return value
        this.setData({ myCVArray: value })
      }
    } catch (e) {
      // Do something when catch error
    }
    //设置时间代码
    var that = this
    wx.getSystemInfo({
      success: function (res) {

        that.width = res.windowWidth < 350 ? res.windowWidth : 350;
        that.height = 500;//res.windowHeight
      },
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showcvdesc: function (e) {
    // console.log(e)
    // console.log(e.detail.x, e.detail.y)
    // console.log(e.detail.x)
    //点击点在canvas中的X,Y值
    var canvasX = e.detail.x - e.currentTarget.offsetLeft;
    var canvasY = e.detail.y - e.currentTarget.offsetTop;
    this.drawClock(canvasX, canvasY);
  },
  // 所有的canvas属性以及Math.sin,Math.cos()等涉及角度的参数都是用弧度表示
  // 时钟
  drawClock: function (targetX, targetY) {

    if (this.data.myCVArray == null || this.data.myCVArray.length == 0) return;

    const ctx = wx.createCanvasContext('clock');
    var height = this.height;
    var width = this.width;
    // 设置文字对应的半径
    var R = width / 2 - 60;
    // 把原点的位置移动到屏幕中间，及宽的一半，高的一半
    ctx.translate(width / 2, width / 2);

    // 画外框
    function drawBackground() {
      // 设置线条的粗细，单位px
      ctx.setLineWidth(8);
      // 开始路径
      ctx.beginPath();
      // 运动一个圆的路径
      // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
      ctx.arc(0, 0, width / 2 - 30, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.setStrokeStyle('#254061')
      // 描出点的路径
      ctx.stroke();
    };

    // 画内框
    function drawInnerground() {
      // 设置线条的粗细，单位px
      ctx.setLineWidth(4);
      // 开始路径
      ctx.beginPath();
      // 运动一个圆的路径
      // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
      ctx.arc(0, 0, width / 2 - 75, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.setStrokeStyle('#e46c0a')
      // 描出点的路径
      ctx.stroke();
    };

    //画矩形
    function drawRectShowDesc(cvdesc) {
      // 设置线条的粗细，单位px
      ctx.setLineWidth(6);
      // 开始路径
      ctx.beginPath();
      ctx.rect(-width / 2, width / 2, width, height - width)
      showDescInRect(cvdesc);

      ctx.closePath();
      ctx.setStrokeStyle('#31859c')
      // 描出点的路径
      ctx.stroke();
    };
    //分段显示长文本内容
    function showDescInRect(longDesc) {
      var desclength = longDesc.length;
      var linecharnumber = 22;
      var linerownumber = desclength / linecharnumber + 1;
      // console.log(linerownumber)
      for (var i = 0; i < linerownumber; i++) {
        var fillstr = longDesc.substring(i * linecharnumber, (i + 1) * linecharnumber);
        ctx.fillText(fillstr, -width / 2 + 15, width / 2 + 30 * (i + 1));
      }
    };

    // 画人生历程段
    function drawCVExpsNum(yearstr) {
      ctx.setFontSize(15);
      var hoursstr = yearstr;
      var hours = hoursstr.split("")
      hours.forEach(function (hour, i) {
        var rad = (2 * Math.PI / 30) * i;
        //var rad = Math.PI/15*i+4.73;
        //调整rad值，使开始显示的起点在表盘上的最高点
        rad = rad + 4.73;
        var x = R * Math.cos(rad);
        var y = R * Math.sin(rad);
        //console.log(i, rad);
        ctx.fillText(hour, x - 6, y + 6);
      });

    };


    // 画时钟数
    function drawHoursNum() {
      ctx.setFontSize(20);
      // 圆的起始位置是从3开始的，所以我们从3开始填充数字
      var hours = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
      hours.forEach(function (hour, i) {
        var rad = (2 * Math.PI / 12) * i;
        var x = R * Math.cos(rad);
        var y = R * Math.sin(rad);
        // 因为微信小程序不支持BaseLine这个属性，所以这里我们只能自己手动调整位置
        if (hour == 12) {
          ctx.fillText(hour, x - 11, y + 6);
        } else if (hour == 6) {
          ctx.fillText(hour, x - 5, y + 6);
        } else {
          ctx.fillText(hour, x - 6, y + 6);
        }
      })
    };

    // 画数字对应的点
    function drawdots() {
      for (let i = 0; i < 60; i++) {
        var rad = 2 * Math.PI / 60 * i;
        var x = (R + 15) * Math.cos(rad);
        var y = (R + 15) * Math.sin(rad);
        ctx.beginPath();
        // 每5个点一个比较大
        if (i % 5 == 0) {
          ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
          ctx.setFillStyle('#e46c0a');
        } else {
          ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
          ctx.setFillStyle('#00b050');
        }
        ctx.fill();
      }
      ctx.closePath();
    }

    // 画时针
    function drawHour(hour, minute) {
      // 保存画之前的状态
      ctx.save();
      ctx.beginPath();
      // 根据小时数确定大的偏移
      var rad = 2 * Math.PI / 12 * hour;
      // 根据分钟数确定小的偏移
      var mrad = 2 * Math.PI / 12 / 60 * minute;
      // 做旋转
      ctx.rotate(rad + mrad);
      ctx.setLineWidth(8);
      // 设置线条结束样式为圆
      ctx.setLineCap('round');
      // 时针向后延伸8个px；
      ctx.moveTo(0, 8);
      // 一开始的位置指向12点的方向，长度为R/2
      ctx.lineTo(0, -R / 2);
      ctx.stroke();
      ctx.closePath();
      // 返回画之前的状态
      ctx.restore();
    }

    // 画分针
    function drawMinute(minute, second) {
      ctx.save();
      ctx.beginPath();
      // 根据分钟数确定大的偏移
      var rad = 2 * Math.PI / 60 * minute;
      // 根据秒数确定小的偏移
      var mrad = 2 * Math.PI / 60 / 60 * second;
      ctx.rotate(rad + mrad);
      // 分针比时针细
      ctx.setLineWidth(6);
      ctx.setLineCap('round');
      ctx.moveTo(0, 10);
      // 一开始的位置指向12点的方向，长度为3 * R / 4
      ctx.lineTo(0, -3 * R / 4);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }

    // 画秒针
    function drawSecond(second, msecond) {
      ctx.save();
      ctx.beginPath();
      var newy = targetY - width / 2;
      var nrad = Math.atan2(targetY - width / 2, targetX - width / 2);
      // console.log(newx + ',' + newy);
      // 根据秒数确定大的偏移
      var rad = 2 * Math.PI / 60 * second;
      // 1000ms=1s所以这里多除个1000
      var mrad = 2 * Math.PI / 60 / 1000 * msecond;
      ctx.rotate(rad + mrad);
      ctx.setLineWidth(4);
      // 设置线条颜色为红色，默认为黑色
      ctx.setStrokeStyle('red');
      ctx.setLineCap('round');
      ctx.moveTo(0, 12);
      ctx.lineTo(0, -R);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }

    function drawArcLine(second) {
      // 设置线条的粗细，单位px
      ctx.setLineWidth(100);
      // 开始路径
      ctx.beginPath();
      // 运动一个圆的路径
      // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
      // var index = second / (60 / 4);
      var adjustrad = 2 * Math.PI / 60 * (second - 7);
      // ctx.arc(0, 0, width / 2 - 140, 0, 0.5 * Math.PI, false);
      //ctx.arc(0, 0, width / 2 - 140, 0.5 * Math.PI, 1 * Math.PI, false);
      // ctx.arc(0, 0, width / 2 - 140, 1 * Math.PI, 1.5 * Math.PI, false);

      ctx.arc(0, 0, width / 2 - 140, 1.5 * Math.PI + adjustrad, 2 * Math.PI + adjustrad, false);

      ctx.setStrokeStyle('#00b050')
      // 描出点的路径
      ctx.stroke();
    }

    //画出中间那个灰色的圆
    function drawDot() {
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, 2 * Math.PI, false);
      ctx.setFillStyle('lightgrey');
      ctx.fill();
      ctx.closePath();
    }

    function Clock(myCVArray) {
      // 实时获取各个参数

      // var hour = now.getHours();
      // var minute = now.getMinutes()
      // var msecond = now.getMilliseconds();
      var now = new Date();
      var second = now.getSeconds();

      var index = second / (60 / myCVArray.length);
      var yearstr = "";
      myCVArray.forEach(function (item, i) {
        if (i > 5) return;
        var str = item.fromdate;
        if (str.length > 4) {
          str = str.substring(0, 4);
        }
        yearstr += "●" + str + "●";
      });
      console.log(yearstr);
      // 依次执行各个方法
      drawBackground();
      drawInnerground();
      drawArcLine(second);
      //drawHoursNum();
      drawCVExpsNum(yearstr);
      drawdots();


      // drawHour(hour, minute);
      // drawMinute(minute, second);
      //drawSecond(second, msecond);
      drawDot();



      //  var strdesc = '加入ANZ，为银行内部项目维护与升级服务。工作于asp.net与sharepoint平台。目前也在开发前段项目，改变ANZ项目中UI普遍老化的情况。';
      var strdesc = myCVArray[parseInt(index)].cvdesc;
      //console.log(strdesc);
      drawRectShowDesc(strdesc);
      // 微信小程序要多个draw才会画出来，所以在最后画出
      ctx.draw();
    }
    // 执行Clock这个方法，实际上执行了所有步骤
    Clock(this.data.myCVArray);
  }




})
