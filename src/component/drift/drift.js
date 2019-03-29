import * as d3 from 'd3';
import $ from 'jquery';

export default function createDrift(config) {
  var id = config.id,
    data = config.data,
    svgWidth = config.width,
    svgHeight = config.height,
    legend = config.legend,
    margin = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40
    };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var svg = d3.select(`${id}`)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);
  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xMin = d3.min(data.series, function (d) {
    return d3.min(d.data, function (d) {
      return d.x
    })
  })
  var xMax = d3.max(data.series, function (d) {
    return d3.max(d.data, function (d) {
      return d.x
    })
  })
  var yMin = d3.min(data.series, function (d) {
    return d3.min(d.data, function (d) {
      return d.y
    })
  })
  var yMax = d3.max(data.series, function (d) {
    return d3.max(d.data, function (d) {
      return d.y
    })
  })

  var x = d3.scaleLinear().domain([xMin, xMax]).range([0, width]).nice()
  var y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]).nice()
  var z = d3.scaleOrdinal(d3.schemeCategory10)

  createAxis(g, x, y, z, width, height, margin, data);
  drawScatter(g, x, y, z, width, height, margin, data);
  drawGridAndText(g, x, y, width, height, margin, data)
  legend && createLegend(id, data.series.map((item) => item.name), d3.schemeCategory10)

}

function drawGridAndText(svg, xScale, yScale, width, height, margin, data) {

  var xTickValues = data.xAxis.grid.value;
  var yTickValues = data.yAxis.grid.value;
  var xTextValue = data.xAxis.grid.description;
  var yTextValue = data.yAxis.grid.description;

  svg.append('g')
    .attr('class', 'grid x-grid')
    .call(d3.axisBottom(xScale)
      .tickSize(-height)
      .tickValues(xTickValues)
      .tickFormat(""))
    .attr('transform', `translate(0, ${height})`)

  svg.append('g')
    .attr('class', 'grid y-grid')
    .call(d3.axisLeft(yScale)
      .tickSize(-width)
      .tickValues(yTickValues)
      .tickFormat(""))

  var xText = svg.append('g')
    .attr('class', 'x-Text')

  var yText = svg.append('g')
    .attr('class', 'y-Text')

  xTextValue.forEach((item, index) => {
    xText.append('text')
      .attr('x', function () {
        if (index === 0) {
          return xScale(xTickValues[index]) / 2
        } else if (index === xTickValues.length) {
          return (width + xScale(xTickValues[index - 1])) / 2
        } else {
          return (xScale(xTickValues[index]) + xScale(xTickValues[index - 1])) / 2
        }
      })
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 'bold')
      .text(item)
  })

  yTextValue.forEach((item, index) => {
    yText.append('text')
      .attr('y', function () {
        if (index === 0) {
          return (height + yScale(yTickValues[index])) / 2
        } else if (index === yTickValues.length) {
          return (yScale(yTickValues[index - 1])) / 2
        } else {
          return (yScale(yTickValues[index]) + yScale(yTickValues[index - 1])) / 2
        }
      })
      .attr('x', margin.left)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 'bold')
      .text(item)
  })
}

function drawScatter(svg, x, y, z, width, height, margin, data) {
  data.series.forEach((item, index) => {
    svg.selectAll(`.scatter`)
      .data(item.data)
      .enter()
      .append("circle")
      .attr("class", `scatter-${index}`)
      .attr("cx", function (d, i) {
        return x(d.x)
      })
      .attr("cy", function (d) {
        return y(d.y)
      })
      .attr('fill', function () {
        return z(item.name)
      })
      .attr('r', 3)
  })
}

function createAxis(svg, xScale, yScale, zScale, width, height, margin, data) {

  svg.append('g')
    .attr('class', 'x-axis')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0, ${height})`)
    .append('text')
    .attr("x", width / 2)
    .attr("y", margin.bottom - 15)
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text(data.xAxis.title)

  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale))
    .append('text')
    .attr("x", -height / 2)
    .attr("y", 10 - margin.left)
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text(data.yAxis.title)

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