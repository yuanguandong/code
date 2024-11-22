import {
  drag,
  select,
  randomUniform,
  scaleOrdinal,
  selectAll,
  interpolateNumber,
  schemeDark2,
} from "d3";
import * as d3 from "d3";
import { cubes3D,_3d } from "d3-3d";

// 创建一个立方体的顶点和面
var cubeData = [
  { x: 0, y: 0, z: 0 },
  { x: 100, y: 0, z: 0 },
  { x: 100, y: 100, z: 0 },
  { x: 0, y: 100, z: 0 },
  { x: 0, y: 0, z: -100 },
  { x: 100, y: 0, z: -100 },
  { x: 100, y: 100, z: -100 },
  { x: 0, y: 100, z: -100 },
];

var cubeFaces = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 3, 7, 4],
  [1, 2, 6, 5],
  [0, 1, 5, 4],
  [2, 3, 7, 6],
];

var width = 400;
var height = 400;

// 创建SVG容器
var svg = d3.select("svg").attr("width", width).attr("height", height);
console.log('d3',d3)
// 创建一个3D投影
var projection = _3d()
  .scale(1)
  .translate([width / 2, height / 2])
  .rotateX(0)
  .rotateY(0);

// 创建一个颜色比例尺
var color = d3.scaleOrdinal(d3.schemeCategory10);

// 创建立方体的面
var cubes = svg.selectAll("g.cube").data(cubeFaces).enter().append("g").attr("class", "cube");

// 绘制立方体的面
var faces = cubes
  .selectAll("path.face")
  .data(function (d) {
    return [d];
  })
  .enter()
  .append("path")
  .attr("class", "face")
  .style("fill", function (d, i) {
    return color(i);
  })
  .style("stroke", "black")
  .attr("d", function (d) {
    var d0 = d.map(function (i) {
      return projection(cubeData[i]);
    });
    return "M" + d0.join("L") + "Z";
  });

// 更新投影
function updateProjection() {
  projection.rotateX(d3.event.beta).rotateY(d3.event.alpha);
  svg
    .selectAll("path.face")
    .attr("d", function (d) {
      var d0 = d.map(function (i) {
        return projection(cubeData[i]);
      });
      return "M" + d0.join("L") + "Z";
    })
    .sort(function (a, b) {
      return (
        d3.mean(b, function (i) {
          return cubeData[i].z;
        }) -
        d3.mean(a, function (i) {
          return cubeData[i].z;
        })
      );
    });
}

// 添加交互事件
d3.select(window).on("mousemove", updateProjection);
