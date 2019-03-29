import * as d3 from 'd3'
import $ from 'jquery'


export default function drawHorizontalBarChart(config) {
    var data = config.data,
        barsInfo = config.barsInfo,
        xAxis = config.xAxis,
        yAxis = config.yAxis,
        svgWidth = config.width,
        svgHeight = config.height,
        colorRange = config.colorRange,
        dimensions = config.dimensions,
        id = config.id,
        idName = id.substr(1, id.length),
        label = config.label,
        requireLegend = config.requireLegend;
    d3
        .select(id)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    var svg = d3.select(id + " svg"),
        margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 70
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (requireLegend !== null && requireLegend !== undefined && requireLegend !== false) {
        $("#Legend_" + idName).remove();
        createLegend(id, barsInfo, colorRange);
    }

    var parseDate = d3.timeFormat('%Y-%m');

    var y = d3.scaleBand()
        .rangeRound([height, 0])
        .paddingInner(0.4);

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var z = d3.scaleOrdinal()
        .range(colorRange);

    data.forEach(function (d) {
        d.date = parseDate(new Date(d.date));
    })

    y.domain(data.map(function (d) {
        return d.date;
    }));
    x.domain([0, d3.max(data, function (d) {
        return d.value
    })]).nice();

    var maxTicks = d3.max(data, function (d) {
        return d.value
    });

    var keys = Object.keys(barsInfo);

    var rect = g.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("y", function (d) {
            return y(d.date);
        })
        .attr("width", function (d) {
            return x(d.value);
        })
        .attr("data-index", function (d) {
            return d.index;
        })
        .attr("height", y.bandwidth())
        .attr("fill", function (d) {
            return z(d.key);
        });

        if(dimensions === '3D' || dimensions === '3d'){
            g.selectAll(".barTop")
            .data(data)
            .enter()
            .append("path")
            .attr("class", "barTop")
            .attr("d", function (d) {
                return `M
                0,
                ${y(d.date)}
                L
                10,
                ${y(d.date) - 10}
                L
                ${x(d.value) + 10}
                ${y(d.date) - 10}
                L
                ${x(d.value)}
                ${y(d.date)}
                Z
                `
            })
            .attr("y", function (d) {
                return y(d.date);
            })
            .attr("fill", function (d) {
                return d3.hcl(z(d.key)).brighter(.7);
            });
    
        g.selectAll(".barRight")
            .data(data)
            .enter()
            .append("path")
            .attr("class", "barRight")
            .attr("d", function (d) {
                return `M
                ${x(d.value)}
                ${y(d.date)}
                L
                ${x(d.value) + 10}
                ${y(d.date) - 10}
                L
                ${x(d.value) + 10}
                ${y(d.date) + y.bandwidth() - 10}
                L
                ${x(d.value)}
                ${y(d.date) + y.bandwidth()}
                Z
                `
            })
            .attr("y", function (d) {
                return y(d.date);
            })
            .attr("fill", function (d) {
                return d3.hcl(z(d.key)).darker(.7);
            });
        }
    
    //add tooltips
    var self = {};
    self.svg = svg;
    self.cssPrefix = "horBar0_";
    self.data = data;
    self.keys = keys;
    self.height = height;
    self.width = width;
    self.label = label;
    self.yAxis = yAxis;
    self.xAxis = xAxis;
    horBarTooltip.addTooltips(self);

    rect.on("mouseover", function () {
        var currentEl = d3.select(this);
        var index = currentEl.attr("data-index");
        horBarTooltip.showTooltip(self, index);
    });

    rect.on("mouseout", function () {
        var currentEl = d3.select(this);
        var index = currentEl.attr("data-index");
        horBarTooltip.hideTooltip(self, index);
    });

    rect.on("mousemove", function () {
        horBarTooltip.moveTooltip(self);
    });


    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(maxTicks))
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom * 0.7)
        .attr("dx", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text(label.xAxis);

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", height * 0.4 * -1)
        .attr("y", margin.left * 0.8 * -1)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("font-weight", "bold")
        .text(label.yAxis);

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
var horBarTooltip = {
    addTooltips: function (pie) {
        var keys = pie.keys;
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
                        index: key + "_" + i + "_" + d[pie.yAxis]
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
                        index: key + "_" + i + "_" + d[pie.yAxis]
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
                var caption = "" + pie.label.xAxis + ":{value}";

                return horBarTooltip.replacePlaceholders(pie, caption, i, {
                    value: d.value,
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
        if (horBarTooltip.currentTooltip === index) {
            fadeInSpeed = 1;
        }

        horBarTooltip.currentTooltip = index;
        d3.select("#" + pie.cssPrefix + "tooltip" + index)
            .transition()
            .duration(fadeInSpeed)
            .style("opacity", function () {
                return 1;
            });

        horBarTooltip.moveTooltip(pie);
    },

    moveTooltip: function (pie) {
        d3.selectAll("#" + pie.cssPrefix + "tooltip" + horBarTooltip.currentTooltip)
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
        d3.select("#" + pie.cssPrefix + "tooltip" + horBarTooltip.currentTooltip)
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

function createLegend(id, barsInfo, colorRange) {
    var z = d3.scaleOrdinal()
        .range(colorRange);
    var idName = id.substr(1, id.length);
    $(id).after("<div id='Legend_" + idName + "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>");
    var keys = Object.keys(barsInfo);
    keys.forEach(function (d) {
        var cloloCode = z(d); //eslint-disable-next-line 
        $("#Legend_" + idName).append("<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
      <span style='background:" +
            cloloCode + //eslint-disable-next-line 
            ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
      <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" +
            barsInfo[d] + //eslint-disable-next-line 
            " </span>\
  </span>");
    });
}