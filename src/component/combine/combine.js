import * as d3 from 'd3'
import $ from 'jquery'

export default function CombineD3(config) {
  function setReSizeEvent(data) {
    var resizeTimer;
    var interval = 500;
    window.removeEventListener('resize', function () {});
    window.addEventListener('resize', function (event) {

      if (resizeTimer !== false) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(function () {
        $(data.mainDiv).empty();
        drawgroupBarChartChart(data);
        clearTimeout(resizeTimer);
      }, interval);
    });
  }

  drawgroupBarChartChart(config);
  setReSizeEvent(config);
}

function creategroupBarChartLegend(mainDiv, columnsInfo, colorRange) {
  var z = d3
    .scaleOrdinal()
    .range(colorRange);
  var mainDivName = mainDiv.substr(1, mainDiv.length);
  $(mainDiv).after("<div id='Legend_" + mainDivName + "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>");
  columnsInfo.forEach(function (item) {
    var cloloCode = z(item); // eslint-disable-next-line
    $("#Legend_" + mainDivName).append("<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
    <span style='background:" +
      cloloCode + // eslint-disable-next-line
      ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
    <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" +
      item + // eslint-disable-next-line
      " </span>\
  </span>");
  });

}

function drawgroupBarChartChart(config) {
  var data = config.data;
  var columnsInfo = config.columnsInfo;
  var xAxis = config.xAxis;
  var yAxis = config.yAxis;
  var svgWidth = config.width;
  var svgHeight = config.height;
  var colorRange = config.colorRange;
  var mainDiv = config.mainDiv;
  var mainDivName = mainDiv.substr(1, mainDiv.length);
  var label = config.label;
  var requireLegend = config.requireLegend;
  d3.select(mainDiv).append("svg").attr("width", svgWidth).attr("height", svgHeight);
  var svg = d3.select(mainDiv + " svg"),
    margin = {
      top: 20,
      right: 40,
      bottom: 70,
      left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  if (requireLegend != null && requireLegend !== undefined && requireLegend !== false) {
    $("#Legend_" + mainDivName).remove();
    creategroupBarChartLegend(mainDiv, columnsInfo, colorRange);

  }
  var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

  var x1 = d3.scaleBand()
    .padding(0.05);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);
  
  var y1 = d3.scaleLinear().rangeRound([height, 0])

  var z = d3.scaleOrdinal(d3.schemeCategory10);

  var keys = columnsInfo;
  x0.domain(data.map(function (d) {
    return d[xAxis];
  }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function (d) {
    return d[columnsInfo[0]]
  })]).nice();

  y1.domain([0, d3.max(data, function (d) {
    return d[columnsInfo[1]]
  })]).nice();

  var element = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function (d) {
      return "translate(" + x0(d[xAxis]) + ",0)";
    });

  var rect = element
    .selectAll("rect")
    .data(function (d, i) {
      return keys.map(function (key) {
        return {
          key: key,
          value: d[key],
          index: key + "_" + i + "_" + d[xAxis]
        };
      });
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x1(d.key);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", x1.bandwidth())
    .attr("data-index", function (d, i) {
      return d.index;
    })
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", function (d) {
      return z(d.key);
    });

  //add tooltips
  var self = {};
  self.svg = svg;
  self.cssPrefix = "groupBar0_";
  self.data = data;
  self.keys = keys;
  self.height = height;
  self.width = width;
  self.label = label;
  self.yAxis = yAxis;
  self.xAxis = xAxis;
  barTooltip.addTooltips(self);

  rect.on("mouseover", function () {
    var currentEl = d3.select(this);
    var index = currentEl.attr("data-index");
    barTooltip.showTooltip(self, index);
  });

  rect.on("mouseout", function () {
    var currentEl = d3.select(this);
    var index = currentEl.attr("data-index");
    barTooltip.hideTooltip(self, index);
  });

  rect.on("mousemove", function () {
    barTooltip.moveTooltip(self);
  });

  g.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x0))
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom * 0.9)
    .attr("dx", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text(label.xAxis);

  g.append("g")
    .attr("class", "axis y-axis")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx",  - height / 2)
    .attr("dy", 10 - margin.left)
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    // .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text(label.yAxis[0]);

    g.append("g")
    .attr("class", "axis y-axis-1")
    .call(d3.axisRight(y1).ticks(null, "s"))
    .attr("transform", `translate(${width}, 0)`)
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", - height / 2)
    .attr("dy", margin.right - 5)
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text(label.yAxis[1]);
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
}
var barTooltip = {
  addTooltips: function (pie) {
    var keys = pie.keys;
    // group the label groups (label, percentage, value) into a single element for simpler positioning
    var element = pie.svg.append("g")
      .selectAll("g")
      .data(pie.data)
      .enter().append("g")
      .attr("class", function (d, i) {
        return pie.cssPrefix + "tooltips_" + i
      });

    element.selectAll("g")
      .data(function (d, i) {
        return keys.map(function (key) {
          return {
            key: key,
            value: d[key],
            index: key + "_" + i + "_" + d[pie.xAxis]
          };
        });
      })
      .enter()
      .append("g")
      .attr("class", pie.cssPrefix + "tooltip")
      .attr("id", function (d, i) {
        return pie.cssPrefix + "tooltip" + d.index;
      })
      .style("opacity", 0)
      .append("rect")
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("x", -2)
      .attr("opacity", 0.71)
      .style("fill", "#000000");

    element.selectAll("g")
      .data(function (d, i) {
        return keys.map(function (key) {
          return {
            key: key,
            value: d[key],
            index: key + "_" + i + "_" + d[pie.xAxis]
          };
        });
      })
      .append("text")
      .attr("fill", function (d) {
        return "#efefef"
      })
      .style("font-size", function (d) {
        return 10;
      })
      .style("font-family", function (d) {
        return "arial";
      })
      .text(function (d, i) {
        var caption = `${d.key}: ${d.value}`;
        return barTooltip.replacePlaceholders(pie, caption, i, {
          runs: d.value,
        });
      });

    element.selectAll("g rect")
      .attr("width", function (d, i) {
        var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + d.index);
        return dims.w + (2 * 4);
      })
      .attr("height", function (d, i) {
        var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + d.index);
        return dims.h + (2 * 4);
      })
      .attr("y", function (d, i) {
        var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + d.index);
        return -(dims.h / 2) + 1;
      });
  },

  showTooltip: function (pie, index) {
    var fadeInSpeed = 250;
    if (barTooltip.currentTooltip === index) {
      fadeInSpeed = 1;
    }

    barTooltip.currentTooltip = index;
    d3.select("#" + pie.cssPrefix + "tooltip" + index)
      .transition()
      .duration(fadeInSpeed)
      .style("opacity", function () {
        return 1;
      });

    barTooltip.moveTooltip(pie);
  },

  moveTooltip: function (pie) {
    d3.selectAll("#" + pie.cssPrefix + "tooltip" + barTooltip.currentTooltip)
      .attr("transform", function (d) {
        var mouseCoords = d3.mouse(this.parentNode);
        var x = mouseCoords[0] + 4 + 2;
        var y = mouseCoords[1] - (2 * 4) - 2;
        return "translate(" + x + "," + y + ")";
      });
  },

  hideTooltip: function (pie, index) {
    d3.select("#" + pie.cssPrefix + "tooltip" + index)
      .style("opacity", function () {
        return 0;
      });

    // move the tooltip offscreen. This ensures that when the user next mouseovers the segment the hidden
    // element won't interfere
    d3.select("#" + pie.cssPrefix + "tooltip" + barTooltip.currentTooltip)
      .attr("transform", function (d, i) {
        // klutzy, but it accounts for tooltip padding which could push it onscreen
        var x = pie.width + 1000;
        var y = pie.height + 1000;
        return "translate(" + x + "," + y + ")";
      });
  },

  replacePlaceholders: function (pie, str, index, replacements) {
    var replacer = function () {
      return function (match) {
        var placeholder = arguments[1];
        if (replacements.hasOwnProperty(placeholder)) {
          return replacements[arguments[1]];
        } else {
          return arguments[0];
        }
      };
    };
    return str.replace(/\{(\w+)\}/g, replacer(replacements));
  }
};