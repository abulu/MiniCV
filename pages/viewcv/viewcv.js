
Page({
  data: {


    index: 1

  },


  onReady: function () {
    this.drawClock();
    this.interva = setInterval(this.drawClock, 1000);
  },

  onHide: function () {
    clearInterval(this.interva)
  },
  onShow: function () {
    //this.interva = setInterval(this.drawClock, 1500);

  },
  onLoad: function () {


  },
  // 所有的canvas属性以及Math.sin,Math.cos()等涉及角度的参数都是用弧度表示
  // 时钟
  drawClock: function () {

    const ctx = wx.createCanvasContext('clock');
    var height = 400;//this.height;
    var width = 350//this.width;
    // 设置文字对应的半径
    var R = width / 2 - 60;
    // 把原点的位置移动到屏幕中间，及宽的一半，高的一半
    //ctx.translate(width / 2, width / 2);

    // 画外框
    function drawLinePeople(headerX, headerY, step) {

      var headerR = 10;
      var neckL = 12;
      var bodyL = 18;
      var handL = 20;
      // 设置线条的粗细，单位px
      ctx.setLineWidth(4);
      // 开始路径
      ctx.beginPath();
      // 运动一个圆的路径
      // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
      ctx.arc(headerX, headerY, headerR, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.setStrokeStyle('#000000')
      // 描出点的路径
      ctx.stroke();
      //画线条人身体部分
      ctx.setLineWidth(3);
      ctx.beginPath();
      ctx.moveTo(headerX, headerY + headerR);
      ctx.lineTo(headerX, headerY + headerR + neckL); //脖子 
      ctx.lineTo(headerX - handL, headerY + headerR + handL + bodyL);
      ctx.lineTo(headerX, headerY + headerR + neckL); //左手
      ctx.lineTo(headerX + handL, headerY + headerR + bodyL + bodyL);
      ctx.lineTo(headerX, headerY + headerR + neckL);//右手
      ctx.lineTo(headerX, headerY + headerR + neckL + bodyL); //身体

      if (step == 1) {
        ctx.lineTo(headerX, headerY + headerR + bodyL + bodyL + bodyL * 1.5);
        ctx.lineTo(headerX, headerY + headerR + neckL + bodyL);//左脚
        ctx.lineTo(headerX + handL, headerY + headerR + bodyL + bodyL + bodyL * 1.5);
        ctx.lineTo(headerX, headerY + headerR + neckL + bodyL);//右脚
      } else if (step == 2) {
        ctx.lineTo(headerX - handL, headerY + headerR + bodyL + bodyL + bodyL * 1.5);
        ctx.lineTo(headerX, headerY + headerR + neckL + bodyL);//左脚
        ctx.lineTo(headerX, headerY + headerR + bodyL + bodyL + bodyL * 1.5);
        ctx.lineTo(headerX, headerY + headerR + neckL + bodyL);//右脚
      } else if (step == 3) {
        ctx.lineTo(headerX - handL, headerY + headerR + bodyL + bodyL + bodyL * 1.5);
        ctx.lineTo(headerX, headerY + headerR + neckL + bodyL);//左脚
        ctx.lineTo(headerX + handL, headerY + headerR + bodyL + bodyL + bodyL * 1.5);
        ctx.lineTo(headerX, headerY + headerR + neckL + bodyL);//右脚
      }


      // ctx.lineTo(100, 456);
      // ctx.lineTo(100, 100);
      ctx.closePath();
      ctx.stroke();
    };

    function Clock(index) {
      index++;
      if (index >20) index = 1;
      var step = index %2;
      var x = 50 +index*10;
      var y = 50;
      drawLinePeople(x, y, step);
      // drawLinePeople(100, 50,2);
      // drawLinePeople(150, 50,3);
      // 微信小程序要多个draw才会画出来，所以在最后画出
      ctx.draw();
      return index;
    }
    // 执行Clock这个方法，实际上执行了所有步骤
    var newindex = Clock(this.data.index);
    //console.log(newindex)
    this.setData({
      index: newindex
    })
  }


})
