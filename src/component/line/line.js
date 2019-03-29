import * as d3 from 'd3'
import $ from 'jquery'

export default function createLine(config) {
  var {
    id,
    data,
    svgWidth,
    svgHeight,
    legend,
  } = config;

  var margin = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40
    },

    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

  var svg = d3
    .select(`${id}`)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
  var g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var dataset = data.series;
  var x = d3.scaleBand()
    .range([0, width])
    .domain(data.category)
  var min = d3.min(data.series, function (d) {
    return d3.min(d.data)
  })
  var max = d3.max(data.series, function (d) {
    return d3.max(d.data)
  })

  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([min, max])
    .nice()

  var z = d3.scaleOrdinal(d3.schemeCategory10)

  var line = d3.line()
    .x(function (d, i) {
      return x(data.category[i])
    })
    .y(function (d) {
      return y(d)
    })

  drawAxis(g, x, y, width, height, margin, data)
  drawLine(g, dataset, line, z, margin);
  drawMarker(g, dataset, x, y, z, margin, data.category);
  
  var series = data.series.map((item) => item.name);
  
  legend && createLegend(id, series, d3.schemeCategory10)
}

function drawAxis(svg, x, y, width, height, margin, data) {
  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append('text')
    .attr("x", width / 2)
    .attr("y", margin.bottom - 15)
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text(data.xAxis.title)

  svg
    .append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y))
    .append('text')
    .attr("dx", - height / 2)
    .attr("dy", 10 - margin.left)
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "center")
    .attr("transform", "rotate(-90)")
    .text(data.yAxis.title)
}

function drawLine(svg, dataset, line, z, margin) {
  dataset.forEach((item, index) => {
    svg.append('path')
      .datum(item.data)
      .attr('class', 'line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', z(index))
      .attr('transform', `translate(${margin.left}, 0)`)
  })
}

function drawMarker(svg, dataset, x, y, z, margin, category) {
  dataset.forEach((item, index) => {
    svg.selectAll(`.dot-${index}`)
      .data(item.data)
      .enter()
      .append("circle")
      .attr("class", `dot-${index}`)
      .attr("cx", function (d, i) {
        return x(category[i])
      })
      .attr("cy", function (d) {
        return y(d)
      })
      .attr('fill', function () {
        return z(index)
      })
      .attr('r', 3)
      .attr('transform', `translate(${margin.left},0)`)
  })

}

function createLegend(mainDiv, series, colorRange) {
  var z = d3.scaleOrdinal()
    .range(colorRange);
  var mainDivName = mainDiv.substr(1, mainDiv.length);
  $(mainDiv).after("<div id='Legend_" + mainDivName + "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>");
  var keys = series;
  keys.forEach(function (d) {
    var cloloCode = z(d); //eslint-disable-next-line 
    $("#Legend_" + mainDivName).append("<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
    <span style='background:" +
      cloloCode + //eslint-disable-next-line 
      ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
    <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" +
      d + //eslint-disable-next-line 
      " </span>\
</span>");
  });
}