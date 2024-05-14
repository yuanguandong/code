/**
 * Created with d3-3d, https://github.com/niekes/d3-3d
 */
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

import {
    cubes3D,
} from "https://cdn.skypack.dev/d3-3d@1.0.0";

document.addEventListener("DOMContentLoaded", () => {
    const startAngle = Math.PI / 6;
    const origin = { x: 480, y: 250 };
    const j = 10;
    
    let scale = 20;
    let cubesData = [];
    let alpha = 0;
    let beta = 0;
    let mx, my, mouseX = 0, mouseY = 0;
    
    const svg = select("svg")
        .call(
          drag()
            .on("drag", dragged)
            .on("start", dragStart)
            .on("end", dragEnd)
        )
        .append("g");
    
    const colorScale = scaleOrdinal(schemeDark2);
    const cubesGroup = svg.append("g").attr("class", "cubes");

    const cubes3d = cubes3D()
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .origin(origin)
        .scale(scale);

  function processData(data, tt) {
    /* --------- CUBES ---------*/

    const cubes = cubesGroup
      .selectAll("g.cube")
      .data(data, (d) => d.id);

    const ce = cubes
      .enter()
      .append("g")
      .attr("class", "cube")
      .attr("fill", (d) => colorScale(d.id))
      .attr("stroke", (d) => color(colorScale(d.id)).darker(2))
      .merge(cubes)
      .sort(cubes3d.sort);

    cubes.exit().remove();

    /* --------- FACES ---------*/

    const faces = cubes.merge(ce).selectAll("path.face").data(
      (d) => d.faces,
      (d) => d.face
    );

    faces
      .enter()
      .append("path")
      .attr("class", "face")
      .attr("fill-opacity", 0.95)
      .classed("d3-3d", true)
      .merge(faces)
      .transition()
      .duration(tt)
      .attr("d", cubes3d.draw);

    faces.exit().remove();

    /* --------- TEXT ---------*/

    const texts = cubes.merge(ce).selectAll("text.text").data((d) => {
      const _t = d.faces.filter((d) => d.face === "top");
      return [{ height: d.height, centroid: _t[0].centroid }];
    });

    texts
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("dy", "-.7em")
      .attr("text-anchor", "middle")
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-weight", "bolder")
      .attr("x", (d) => origin.x + scale * d.centroid.x)
      .attr("y", (d) => origin.y + scale * d.centroid.y)
      .classed("d3-3d", true)
      .merge(texts)
      .transition()
      .duration(tt)
      .attr("fill", "black")
      .attr("stroke", "none")
      .attr("x", (d) => origin.x + scale * d.centroid.x)
      .attr("y", (d) => origin.y + scale * d.centroid.y)
      .tween("text", function (d) {
        const that = select(this);
        const i = interpolateNumber(+that.text(), Math.abs(d.height));
        return function (t) {
          that.text(i(t).toFixed(1));
        };
      });

    texts.exit().remove();

    /* --------- SORT TEXT & FACES ---------*/

    ce.selectAll(".d3-3d").sort(cubes3d.sort);
  }

  function init() {
    cubesData = [];
    let cnt = 0;
    for (let z = -j / 2; z <= j / 2; z = z + 5) {
      for (let x = -j; x <= j; x = x + 5) {
        const h = randomUniform(-2, -7)();
        const _cube = makeCube(h, x, z);
        _cube.id = "cube-" + cnt++;
        _cube.height = h;
        cubesData.push(_cube);
      }
    }
    processData(cubes3d(cubesData), 1000);
  }

  function dragStart(event) {
    mx = event.x;
    my = event.y;
  }

  function dragged(event) {
    beta = (event.x - mx + mouseX) * (Math.PI / 230);
    alpha = (event.y - my + mouseY) * (Math.PI / 230) * -1;
    processData(
      cubes3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
        cubesData
      ),
      0
    );
  }

  function dragEnd(event) {
    mouseX = event.x - mx + mouseX;
    mouseY = event.y - my + mouseY;
  }

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

  selectAll("button").on("click", init);

  init();
});
