import * as d3 from "d3";
import $ from "jquery";



export default function StackBarD3(config) {
  var id = config.id,
    data = config.data,
    svgWidth = config.width,
    svgHeight = config.height,
    legend = config.legend,
    dimensions = config.dimensions,
    margin = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40
    },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom,
    group = ["Laptops", "Processor", "Ram"],
    parseDate = d3.timeFormat("%Y-%m");

  var salesData = data;
  salesData.forEach(function (d) {
    d = type(d);
  });

  var layers = d3
    .stack()
    .keys(group)
    .offset(d3.stackOffsetDiverging)(salesData);

  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var x = d3
    .scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

  x.domain(
    salesData.map(function (d) {
      return d.date;
    })
  );

  var y = d3.scaleLinear().rangeRound([height, 0]);

  y.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)]);

  function stackMin(layers) {
    return d3.min(layers, function (d) {
      return d[0];
    });
  }

  function stackMax(layers) {
    return d3.max(layers, function (d) {
      return d[1];
    });
  }

  var z = d3.scaleOrdinal(d3.schemeCategory10);

  var bandwidth = x.bandwidth() - 20

  var maing = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll("g")
    .data(layers);

  var g = maing
    .enter()
    .append("g")
    .attr("fill", function (d) {
      return z(d.key);
    });

  g
    .selectAll("rect")
    .data(function (d) {
      d.forEach(function (d1) {
        d1.key = d.key;
        return d1;
      });
      return d;
    })
    .enter()
    .append("rect")
    .attr("data", function (d) {
      var data = {};
      data["key"] = d.key;
      data["value"] = d.data[d.key];
      var total = 0;
      group.forEach(function (d1) {
        total = total + d.data[d1];
      });
      data["total"] = total;
      return JSON.stringify(data);
    })
    .attr("width", bandwidth)
    .attr("x", function (d) {
      return x(d.data.date) + 10;
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    });
  if (dimensions === '3d' || dimensions === '3D') {
    g
      .selectAll(".stackTop")
      .data(function (d) {
        d.forEach(function (d1) {
          d1.key = d.key;
          return d1;
        });
        return d;
      })
      .enter()
      .append("path")
      .attr("class", 'stackTop')
      .attr("stroke", function (d) {
        return z(d.key);
      })
      .attr("fill", function (d) {
        return d3.hsl(z(d.key)).brighter(0.7)
      })
      .attr("d", function (d) {
        return `M 
        ${x(d.data.date) + 10}
        ${y(d[1])}
        L
        ${x(d.data.date) + 20}
        ${y(d[1]) - 10}
        L
        ${x(d.data.date) + 20 + bandwidth}
        ${y(d[1]) - 10}
        L
        ${x(d.data.date) + 10 + bandwidth}
        ${y(d[1])}
        Z
        `
      })

    g
      .selectAll(".stackRight")
      .data(function (d) {
        d.forEach(function (d1) {
          d1.key = d.key;
          return d1;
        });
        return d;
      })
      .enter()
      .append("path")
      .attr("class", 'stackRight')
      .attr("stroke", function (d) {
        return z(d.key);
      })
      .attr("fill", function (d) {
        return d3.hsl(z(d.key)).darker(0.7)
      })
      .attr("d", function (d) {
        return `M 
        ${x(d.data.date) + 10 + bandwidth}
        ${y(d[1])}
        L
        ${x(d.data.date) + 20 + bandwidth}
        ${y(d[1]) - 10}
        L
        ${x(d.data.date) + 20 + bandwidth}
        ${y(d[0]) - 10}
        L
        ${x(d.data.date) + 10 + bandwidth}
        ${y(d[0])}
        Z
        `
      })
  }

  g
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 15)
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text("Month");

  g
    .append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 5 - margin.left)
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text("Sales");

  legend && createLegend(id, group, d3.schemeCategory10);

  function type(d) {
    d.date = parseDate(new Date(d.date));
    group.forEach(function (c) {
      d[c] = +d[c];
    });
    return d;
  }
};

function createLegend(id, series, colorRange) {
  var z = d3.scaleOrdinal(colorRange);
  var idName = id.substr(1, id.length);
  $(id).after(
    "<div id='Legend_" +
    idName +
    "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>"
  );
  var keys = series;
  keys.forEach(function (d) {
    var cloloCode = z(d);
    $("#Legend_" + idName).append( // eslint-disable-next-line
      "<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
      <span style='background:" +
      cloloCode + // eslint-disable-next-line
      ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
      <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" +
      d + // eslint-disable-next-line
      " </span>\
      </span>"
    );
  });
}