import {
  drag,
  color,
  select,
  randomUniform,
  scaleOrdinal,
  selectAll,
  interpolateNumber,
  schemeDark2,
} from "https://cdn.skypack.dev/d3@7.8.5";

import { cubes3D } from "https://cdn.skypack.dev/d3-3d@1.0.0";

const cubes3d = cubes3D()
  .scale(200) // 设置立方体的缩放比例
  .origin({ x: 480, y: 250 }); // 设置投影的原点

  const cubeData = makeCube(10,1,1)
// const cubeData = [
//   [
//     { x: -1, y: -1, z: -1 },
//     { x: -1, y: -1, z: 1 },
//     { x: -1, y: 1, z: 1 },
//     { x: -1, y: 1, z: -1 },
//   ],
//   [
//     { x: 1, y: -1, z: -1 },
//     { x: 1, y: -1, z: 1 },
//     { x: 1, y: 1, z: 1 },
//     { x: 1, y: 1, z: -1 },
//   ],
//   // 可以添加更多立方体的数据
// ];

const projectedData = cubes3d(cubeData[0]);
const svg = select("body").append("svg").attr("width", 960).attr("height", 500);

svg
.append("path")
.selectAll("path")
.data(projectedData)
.enter()
.append("path")
.attr("d", (d) => d.draw()) // 使用 d3-3d 提供的 draw 方法来获取 SVG path 字符串
.attr("fill", "lightsteelblue")
.attr("transform", (d) => `translate(${d.centroid.x},${d.centroid.y})`);

function makeCube(h, x, z) {
  return [
    { x: x - 1, y: h, z: z + 1 }, // FRONT TOP LEFT
    { x: x - 1, y: 0, z: z + 1 }, // FRONT BOTTOM LEFT
    { x: x + 1, y: 0, z: z + 1 }, // FRONT BOTTOM RIGHT
    { x: x + 1, y: h, z: z + 1 }, // FRONT TOP RIGHT
    { x: x - 1, y: h, z: z - 1 }, // BACK  TOP LEFT
    { x: x - 1, y: 0, z: z - 1 }, // BACK  BOTTOM LEFT
    { x: x + 1, y: 0, z: z - 1 }, // BACK  BOTTOM RIGHT
    { x: x + 1, y: h, z: z - 1 }, // BACK  TOP RIGHT
  ];
}
