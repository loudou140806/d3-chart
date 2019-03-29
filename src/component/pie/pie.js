import * as d3 from "d3";
import $ from 'jquery'

function pieTop(d, rx, ry, ir) {
  if (d.endAngle - d.startAngle === 0) return "M 0 0";
  var sx = rx * Math.cos(d.startAngle),
    sy = ry * Math.sin(d.startAngle),
    ex = rx * Math.cos(d.endAngle),
    ey = ry * Math.sin(d.endAngle);

  var ret = [];
  ret.push(
    "M",
    sx,
    sy,
    "A",
    rx,
    ry,
    "0",
    d.endAngle - d.startAngle > Math.PI ? 1 : 0,
    "1",
    ex,
    ey,
    "L",
    ir * ex,
    ir * ey
  );
  ret.push(
    "A",
    ir * rx,
    ir * ry,
    "0",
    d.endAngle - d.startAngle > Math.PI ? 1 : 0,
    "0",
    ir * sx,
    ir * sy,
    "z"
  );
  return ret.join(" ");
}

function pieOuter(d, rx, ry, h) {
  var startAngle = d.startAngle > Math.PI ? Math.PI : d.startAngle;
  var endAngle = d.endAngle > Math.PI ? Math.PI : d.endAngle;

  var sx = rx * Math.cos(startAngle),
    sy = ry * Math.sin(startAngle),
    ex = rx * Math.cos(endAngle),
    ey = ry * Math.sin(endAngle);

  var ret = [];
  ret.push(
    "M",
    sx,
    h + sy,
    "A",
    rx,
    ry,
    "0 0 1",
    ex,
    h + ey,
    "L",
    ex,
    ey,
    "A",
    rx,
    ry,
    "0 0 0",
    sx,
    sy,
    "z"
  );
  return ret.join(" ");
}

function pieInner(d, rx, ry, h, ir) {
  var startAngle = d.startAngle < Math.PI ? Math.PI : d.startAngle;
  var endAngle = d.endAngle < Math.PI ? Math.PI : d.endAngle;

  var sx = ir * rx * Math.cos(startAngle),
    sy = ir * ry * Math.sin(startAngle),
    ex = ir * rx * Math.cos(endAngle),
    ey = ir * ry * Math.sin(endAngle);

  var ret = [];
  ret.push(
    "M",
    sx,
    sy,
    "A",
    ir * rx,
    ir * ry,
    "0 0 1",
    ex,
    ey,
    "L",
    ex,
    h + ey,
    "A",
    ir * rx,
    ir * ry,
    "0 0 0",
    sx,
    h + sy,
    "z"
  );
  return ret.join(" ");
}

function getPercent(d) {
  return d.endAngle - d.startAngle > 0.2 ?
    Math.round((1000 * (d.endAngle - d.startAngle)) / (Math.PI * 2)) / 10 +
    "%" :
    "";
}

export default function Donut3D(config) {
  var id = config.id,
    data = config.data,
    width = config.width || 300,
    height = config.height || 300,
    x = config.x /*center x*/ ,
    y = config.y /*center y*/ ,
    rx = config.rx /*radius x*/ ,
    ry = config.ry /*radius y*/ ,
    h = config.h /*height*/ ,
    ir = config.ir /*inner radius*/ ,
    dimensions = config.dimensions,
    legend = config.legend,
    idName = id.substr(1, id.length),
    series = data.map(item => item.label)

  var _data = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.value;
    })(data);
  var z = d3.scaleOrdinal().range(d3.schemeCategory10).domain(data.map(item => item.label))
  if (legend != null && legend !== undefined && legend !== false) {
    $("#Legend_" + idName).remove();
    createLegend(id, series, z);
  }

  var svg = d3.select("#" + idName).append("svg").attr("width", width).attr("height", height)
  var slices = svg
    .append("g")
    .attr("transform", "translate(" + x + "," + y + ")")
    .attr("class", "slices");


  if (dimensions === '3d' || dimensions === '3D') {
    slices
      .selectAll(".innerSlice")
      .data(_data)
      .enter()
      .append("path")
      .attr("class", "innerSlice")
      .style("fill", function (d) {
        return d3.hsl(z(d.data.label)).darker(0.7);
      })
      .attr("d", function (d) {
        return pieInner(d, rx + 0.5, ry + 0.5, h, ir);
      })
      .each(function (d) {
        this._current = d;
      });

    slices
      .selectAll(".outerSlice")
      .data(_data)
      .enter()
      .append("path")
      .attr("class", "outerSlice")
      .style("fill", function (d) {
        return d3.hsl(z(d.data.label)).darker(0.7);
      })
      .attr("d", function (d) {
        return pieOuter(d, rx - 0.5, ry - 0.5, h);
      })
      .each(function (d) {
        this._current = d;
      });
  }
  slices
    .selectAll(".topSlice")
    .data(_data)
    .enter()
    .append("path")
    .attr("class", "topSlice")
    .style("fill", function (d) {
      return z(d.data.label);
    })
    .style("stroke", function (d) {
      return z(d.data.label);
    })
    .attr("d", function (d) {
      if (dimensions === '3d' || dimensions === '3D') {
        return pieTop(d, rx, ry, ir)
      } else {
        return pieTop(d, rx, rx, ir);
      }
    })
    .each(function (d) {
      this._current = d;
    });

  slices
    .selectAll(".percent")
    .data(_data)
    .enter()
    .append("text")
    .attr("class", "percent")
    .attr("x", function (d) {
      return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
    })
    .attr("y", function (d) {
      return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
    })
    .text(getPercent)
    .each(function (d) {
      this._current = d;
    });
};

function createLegend(id, series, colorRange) {
  var z = d3.scaleOrdinal()
    .range(colorRange);
  var idName = id.substr(1, id.length);
  $(id).after("<div id='Legend_" + idName + "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>");
  series.forEach(function (d) {
    var cloloCode = z(d); //eslint-disable-next-line 
    $("#Legend_" + idName).append("<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
    <span style='background:" +
      colorRange(d) + //eslint-disable-next-line 
      ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
    <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" +
      d + //eslint-disable-next-line 
      " </span>\
</span>");
  });
}