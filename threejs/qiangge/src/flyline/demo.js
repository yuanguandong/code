import * as THREE from "three";

const output_fragment = `
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif
// 设置透明度变化
float r = distance(gl_PointCoord, vec2(0.5, 0.5));
// diffuseColor.a = diffuseColor.a*(1.0 - r/0.5);//透明度线性变化
diffuseColor.a = diffuseColor.a*pow( 1.0 - r/0.5, 6.0 );//透明度非线性变化  参数2越大，gl_PointSize要更大，可以直接设置着色器代码，可以设置材质size属性
gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`;

export class Demo {
  //取点索引位置
  index = 0;

  //从曲线上获取点数量
  num = 15;

  // 所有点
  points = [];

  target = null;

  // 目标点坐标
  targetPoints = [];

  // 目标点渲染几何体
  targetGeometry = null;

  // 分段数量
  segment = 100;

  // 颜色
  colors = [0x59e218, 0x17d33a];

  // 点大小
  size = 3;

  constructor(render, scene) {
    this.render = render;
    this.scene = scene;
    const target = this.init();
    this.target = target;
    this.scene.add(target);
    // this.animation();
  }

  init() {
    const me = this;

    /**
     * 创建线条模型
     */
    // var geometry = new THREE.BufferGeometry(); //创建一个缓冲类型几何体
    // 三维样条曲线
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(100, 80, -100),
      new THREE.Vector3(0, 80, 0),
      new THREE.Vector3(-100, 80, 100),
    ]);

    //曲线上等间距返回多个顶点坐标
    me.points = curve.getSpacedPoints(me.segment); //分段数100，返回101个顶点

    // setFromPoints方法从points中提取数据赋值给attributes.position
    // geometry.setFromPoints(me.points);
    // var material = new THREE.LineBasicMaterial({
    //   color: 0x006666, //轨迹颜色
    // });
    // // 线条模型对象
    // var line = new THREE.Line(geometry, material);
    // model.add(line);

    // 飞线线段
    me.targetPoints = me.points.slice(me.index, me.index + me.num); //从曲线上获取一段
    var curve = new THREE.CatmullRomCurve3(me.targetPoints);
    var newPoints2 = curve.getSpacedPoints(100); //获取更多的点数
    var targetGeometry = new THREE.BufferGeometry();
    me.targetGeometry = targetGeometry;
    targetGeometry.setFromPoints(newPoints2);
    // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
    var percentArr = []; //attributes.percent的数据
    for (var i = 0; i < newPoints2.length; i++) {
      percentArr.push(i / newPoints2.length);
    }
    var percentAttribue = new THREE.BufferAttribute(new Float32Array(percentArr), 1);
    targetGeometry.attributes.percent = percentAttribue;
    // 批量计算所有顶点颜色数据
    var colorArr = [];
    for (var i = 0; i < newPoints2.length; i++) {
      var color1 = new THREE.Color(me.colors[0]); //轨迹线颜色 青色
      var color2 = new THREE.Color(me.colors[1]); //黄色
      var color = color1.lerp(color2, i / newPoints2.length);
      colorArr.push(color.r, color.g, color.b);
    }
    // 设置几何体顶点颜色数据
    targetGeometry.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3);

    // 点模型渲染几何体每个顶点
    var PointsMaterial = new THREE.PointsMaterial({
      // color: 0xffff00,
      size: me.size * 5.0, //点大小
      vertexColors: true,
      transparent: true, //开启透明计算
      depthTest: false,
    });
    const flyPoints = new THREE.Points(targetGeometry, PointsMaterial);

    // 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
    PointsMaterial.onBeforeCompile = function (shader) {
      // 顶点着色器中声明一个attribute变量:百分比
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        [
          "attribute float percent;", //顶点大小百分比变量，控制点渲染大小
          "void main() {",
        ].join("\n") // .join()把数组元素合成字符串
      );
      // 调整点渲染大小计算方式
      shader.vertexShader = shader.vertexShader.replace(
        "gl_PointSize = size;",
        ["gl_PointSize = percent * size;"].join("\n") // .join()把数组元素合成字符串
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <output_fragment>",
        output_fragment
      );
    };

    return flyPoints;
  }

  animation() {
    const me = this;
    // 飞线动画
    var indexMax = me.points.length - me.num; //飞线取点索引范围
    if (me.index > indexMax) {
      me.index = 0;
    }
    me.index += 1;
    me.targetPoints = me.points.slice(me.index, me.index + me.num); //从曲线上获取一段
    var curve = new THREE.CatmullRomCurve3(me.targetPoints);
    var newPoints2 = curve.getSpacedPoints(100); //获取更多的点数
    me.targetGeometry.setFromPoints(newPoints2);

    requestAnimationFrame(me.animation.bind(me));
  }

  destroy() {
    this.scene.remove(this.line);
  }
}
