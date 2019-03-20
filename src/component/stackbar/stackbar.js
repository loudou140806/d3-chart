import * as d3 from "d3";
import $ from "jquery";

const StackBarD3 = {};

StackBarD3.draw = function (data) {
  function createChartLegend(mainDiv, group) {
    var z = d3.scaleOrdinal(d3.schemeCategory10);
    var mainDivName = mainDiv.substr(1, mainDiv.length);
    $(mainDiv).after(
      "<div id='Legend_" +
      mainDivName +
      "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>"
    );
    var keys = group;
    keys.forEach(function (d) {
      var cloloCode = z(d);
      $("#Legend_" + mainDivName).append(// eslint-disable-next-line
        "<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
        <span style='background:" +
        cloloCode + // eslint-disable-next-line
        ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
        <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" +
        d +// eslint-disable-next-line
        " </span>\
        </span>"
      );
    });
  }
  var group = ["Laptops", "Processor", "Ram"];
  var parseDate = d3.timeFormat("%Y-%m");
  var mainDiv = "#stackBar";
  var mainDivName = "charts";
  createChartLegend(mainDiv, group);
  var salesData = data;
  salesData.forEach(function (d) {
    d = type(d);
  });
  var layers = d3
    .stack()
    .keys(group)
    .offset(d3.stackOffsetDiverging)(salesData);

  var svg = d3
    .select("#stackBar")
    .append("svg")
    .attr("width", 600)
    .attr("height", 300),
    margin = {
      top: 20,
      right: 20,
      bottom: 70,
      left: 40
    },
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var x = d3
    .scaleBand()
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);

  x.domain(
    salesData.map(function (d) {
      return d.date;
    })
  );

  var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

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
    .selectAll("g")
    .data(layers);
  var g = maing
    .enter()
    .append("g")
    .attr("fill", function (d) {

      return z(d.key);
    });

  var rect = g
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
    .attr("class", '.stackTop')
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
    .attr("class", '.stackRight')
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


  rect.on("mouseover", function () {
    var currentEl = d3.select(this);
    var fadeInSpeed = 120;
    d3.select("#recttooltip_" + mainDivName)
      .transition()
      .duration(fadeInSpeed)
      .style("opacity", function () {
        return 1;
      });
    d3.select("#recttooltip_" + mainDivName).attr("transform", function (d) {
      var mouseCoords = d3.mouse(this.parentNode);
      var xCo = 0;
      if (mouseCoords[0] + 10 >= width * 0.80) {
        xCo = mouseCoords[0] - parseFloat(d3.selectAll("#recttooltipRect_" + mainDivName)
          .attr("width"));
      } else {
        xCo = mouseCoords[0] + 10;
      }
      var x = xCo;
      var yCo = 0;
      if (mouseCoords[0] + 10 >= width * 0.80) {
        yCo = mouseCoords[1] + 10;
      } else {
        yCo = mouseCoords[1];
      }
      x = xCo;
      var y = yCo;
      return "translate(" + x + "," + y + ")";
    });
    //CBT:calculate tooltips text
    var tooltipData = JSON.parse(currentEl.attr("data"));
    // var tooltipsText = "";
    d3.selectAll("#recttooltipText_" + mainDivName).text("");
    var yPos = 0;
    d3.selectAll("#recttooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text(tooltipData.key + ":  " + tooltipData.value);
    yPos = yPos + 1;
    d3.selectAll("#recttooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text("Total:  " + tooltipData.total);
    //CBT:calculate width of the text based on characters
    var dims = helpers.getDimensions("recttooltipText_" + mainDivName);
    d3.selectAll("#recttooltipText_" + mainDivName + " tspan")
      .attr("x", dims.w + 4);

    d3.selectAll("#recttooltipRect_" + mainDivName)
      .attr("width", dims.w + 10)
      .attr("height", dims.h + 20);

  });

  rect.on("mousemove", function () {
    var currentEl = d3.select(this);
    currentEl.attr("r", 7);
    d3.selectAll("#recttooltip_" + mainDivName)
      .attr("transform", function (d) {
        var mouseCoords = d3.mouse(this.parentNode);
        var xCo = 0;
        if (mouseCoords[0] + 10 >= width * 0.80) {
          xCo = mouseCoords[0] - parseFloat(d3.selectAll("#recttooltipRect_" + mainDivName)
            .attr("width"));
        } else {
          xCo = mouseCoords[0] + 10;
        }
        var x = xCo;
        var yCo = 0;
        if (mouseCoords[0] + 10 >= width * 0.80) {
          yCo = mouseCoords[1] + 10;
        } else {
          yCo = mouseCoords[1];
        }
        x = xCo;
        var y = yCo;
        return "translate(" + x + "," + y + ")";
      });
  });
  rect.on("mouseout", function () {
    // var currentEl = d3.select(this);
    d3.select("#recttooltip_" + mainDivName)
      .style("opacity", function () {
        return 0;
      })
      .attr("transform", function (d, i) {
        // klutzy, but it accounts for tooltip padding which could push it onscreen
        var x = -500;
        var y = -500;
        return "translate(" + x + "," + y + ")";
      });
  });

  svg
    .append("g")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom * 0.5)
    .attr("dx", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("Month");

  svg
    .append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 5 - margin.left)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text("Sales");

  var rectTooltipg = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .attr("id", "recttooltip_" + mainDivName)
    .attr("style", "opacity:0")
    .attr("transform", "translate(-500,-500)");

  rectTooltipg
    .append("rect")
    .attr("id", "recttooltipRect_" + mainDivName)
    .attr("x", 0)
    .attr("width", 120)
    .attr("height", 80)
    .attr("opacity", 0.71)
    .style("fill", "#000000");

  rectTooltipg
    .append("text")
    .attr("id", "recttooltipText_" + mainDivName)
    .attr("x", 30)
    .attr("y", 15)
    .attr("fill", function () {
      return "#fff";
    })
    .style("font-size", function (d) {
      return 10;
    })
    .style("font-family", function (d) {
      return "arial";
    })
    .text(function (d, i) {
      return "";
    });

  function type(d) {
    d.date = parseDate(new Date(d.date));
    group.forEach(function (c) {
      d[c] = +d[c];
    });
    return d;
  }

  var helpers = {
    getDimensions: function (id) {
      var el = document.getElementById(id);
      var w = 0,
        h = 0;
      if (el) {
        var dimensions = el.getBBox();
        w = dimensions.width;
        h = dimensions.height;
      } else {
        console.log("error: getDimensions() " + id + " not found.");
      }
      return {
        w: w,
        h: h
      };
    }
  };
};

export default StackBarD3;