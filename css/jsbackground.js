// transparent-grid命名和CSS中的对应
registerPaint(
  "smooth-corners",
  class {
    paint(ctx, size) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(200, 200, 50, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
  }
);

registerPaint(
  "transparent-grid",
  class {
    paint(context, size) {
      // 两个格子颜色
      var color1 = "#fff",
        color2 = "#eee";
      // 格子尺寸
      var units = 8;
      // 横轴数轴循环遍历下
      for (var x = 0; x < size.width; x += units) {
        for (var y = 0; y < size.height; y += units) {
          context.fillStyle = (x + y) % (units * 2) === 0 ? color1 : color2;
          context.fillRect(x, y, units, units);
        }
      }
    }
  }
);
