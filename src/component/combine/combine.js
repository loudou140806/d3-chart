import * as d3 from 'd3'
import $ from 'jquery'

export default function CombineD3(config) {
  var data = config.data,
    columnsInfo = config.data.series.map((item) => item.name),
    category = config.data.category,
    svgWidth = config.width,
    svgHeight = config.height,
    dimensions = config.dimensions,
    id = config.id,
    idName = id.substr(1, id.length),
    legend = config.legend,
    margin = {
      top: 20,
      right: 40,
      bottom: 40,
      left: 40
    };

  var svg = d3
    .select(id)
    .append("svg")
    .attr('class', 'combine')
    .attr("width", svgWidth)
    .attr("height", svgHeight),

    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

  var g = svg
    .append("g")
    .attr("class", "column")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  if (legend != null && legend !== undefined && legend !== false) {
    $("#Legend_" + idName).remove();
    createLegend(id, columnsInfo, d3.schemeCategory10);
  }
  var x;
  if (dimensions === '3d' || dimensions === '3D') {
    x = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(.5)
      .paddingOuter(.3)
      .domain(category);
  } else {
    x = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(.2)
      .paddingOuter(.3)
      .domain(category);
  }


  var y = d3
    .scaleLinear()
    .rangeRound([height, 0]);
  var y1 = d3
    .scaleLinear()
    .rangeRound([height, 0])
  var z = d3
    .scaleOrdinal(d3.schemeCategory10);

  var columnData = [],
    lineData = [];

  data.series.forEach((item, index) => {
    item.type === 'column' &&
      item.data.forEach((d) => {
        columnData.push({
          key: item.name,
          value: d
        })
      })
    item.type === 'line' &&
      item.data.forEach((d) => {
        lineData.push({
          key: item.name,
          value: d
        })
      })
  })

  var yMin = d3.min(columnData, function (d) {
    return d.value
  })
  var yMax = d3.max(columnData, function (d) {
    return d.value
  })
  y.domain([yMin, yMax]).nice();

  var y1Min = d3.min(lineData, function (d) {
    return d.value
  })
  var y1Max = d3.max(lineData, function (d) {
    return d.value
  })

  y1.domain([y1Min, y1Max]).nice();

  var line = d3.line()
    .x(function (d, i) {
      return x(category[i]) + x.bandwidth() / 2;
    })
    .y(function (d) {
      return y1(d.value);
    });

  g.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 15)
    .attr("dx", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text(data.xAxis.title);

  g.append("g")
    .attr("class", "axis y-axis")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
    .attr("dx", -height / 2)
    .attr("dy", 10 - margin.left)
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text(data.yAxis[0].title)

  g.append("g")
    .attr("class", "axis y1-axis")
    .call(d3.axisRight(y1).ticks(null, "s"))
    .attr("transform", `translate(${width}, 0)`)
    .append("text")
    .attr("dx", -height / 2)
    .attr("dy", margin.right - 5)
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text(data.yAxis[1].title);

  g
    .selectAll("rect")
    .data(columnData)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return x(category[i]);
    })
    .attr("y", function (d) {
      return y(d.value)
    })
    .attr("width", x.bandwidth())
    .attr("data-index", function (d, i) {
      return d.index;
    })
    .attr("height", function (d) {
      return height - y(d.value)
    })
    .attr("fill", function (d) {
      return z(d.key);
    });

  if (dimensions === '3d' || dimensions === '3D') {
    g
      .selectAll(".combineColumeTop")
      .data(columnData)
      .enter()
      .append("path")
      .attr("class", "combineColumeTop")
      .attr("d", function (d, i) {
        return `M
            ${x(category[i])},
            ${y(d.value)}
            L
            ${x(category[i])+ 10},
            ${y(d.value)-10}
            L
            ${x(category[i]) +x.bandwidth() + 10},
            ${y(d.value) - 10}
            L
            ${x(category[i])+ x.bandwidth()},
            ${y(d.value)}
            z
            `
      })
      .attr("data-index", function (d, i) {
        return d.index;
      })
      .attr("fill", function (d) {
        return d3.hsl(z(d.key)).brighter(.7);
      });

    g
      .selectAll(".combineColumeRight")
      .data(columnData)
      .enter()
      .append("path")
      .attr("class", "combineColumeRight")
      .attr("d", function (d, i) {
        return `M
          ${x(category[i])+ x.bandwidth()},
          ${y(d.value)}
          L
          ${x(category[i]) +x.bandwidth() + 10},
          ${y(d.value) - 10}
          L
          ${x(category[i]) +x.bandwidth() + 10}
          ${height - 10}
          L
          ${x(category[i])+ x.bandwidth()},
          ${height}
          z
        `
      })
      .attr("data-index", function (d, i) {
        return d.index;
      })
      .attr("fill", function (d) {
        return d3.hsl(z(d.key)).darker(.7);
      });
  }

  svg.append("path")
    .datum(lineData)
    .attr('class', 'line')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', function (d) {
      return z(d.key)
    })
    .attr('stroke-width', 2)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  // .data(lineData)
  // .attr('class', 'line')
  // .attr('d', line)
  // .attr('fill', 'none')
  // .attr('stroke', function (d) {
  //   return z(d.key)
  // })
  // .attr('transform', `translate(${margin.left}, 0)`)

}

function createLegend(id, columnsInfo, colorRange) {
  var z = d3
    .scaleOrdinal()
    .range(colorRange);
  var idName = id.substr(1, id.length);
  $(id).after("<div id='Legend_" + idName + "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>");
  columnsInfo.forEach(function (item) {
    var cloloCode = z(item); // eslint-disable-next-line
    $("#Legend_" + idName).append("<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
    <span style='background:" +
      cloloCode + // eslint-disable-next-line
      ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
    <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" +
      item + // eslint-disable-next-line
      " </span>\
  </span>");
  })
}