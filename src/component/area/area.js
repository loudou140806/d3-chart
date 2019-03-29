import * as d3 from 'd3'
import $ from 'jquery'

export default function createArea(config) {

    var svgWidth = config.width,
        svgHeight = config.height,
        rawData = config.data,
        id = config.id,
        margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 40
        },
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

    // var parseDate = d3.timeFormat('%Y-%m-%d')

    var data = rawData.map(function (d) {
        return {
            date: new Date(d.date),
            pct75: d.pct75 / 1000,
            pct95: d.pct95 / 1000
        };
    });
    var x = d3.scaleTime().range([0, width])
        .domain(d3.extent(data, function (d) {
            return d.date;
        })),
        y = d3.scaleLinear().range([height, 0])
        .domain([0, d3.max(data, function (d) {
            return d.pct95;
        })]),
        z = d3.scaleOrdinal(d3.schemeCategory10).domain(['pct75', 'pct95']);
    var xAxis = d3
        .axisBottom()
        .scale(x)
        .ticks(6)
        .tickFormat(d3.timeFormat('%Y-%m-%d')),
        
        yAxis = d3
        .axisLeft(y)

    var svg = d3.select(`${id}`).append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('clipPath')
        .attr('id', 'rect-clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

    addAxis(svg, xAxis, yAxis, height);
    drawPaths(svg, data, x, y, z);
    var legendInfo = {
        "pct75": 8016,
        "pct95": 12765
    }
    createLegend(id, legendInfo, d3.schemeCategory10)
}


function addAxis(svg, xAxis, yAxis, height) {

    var axes = svg.append('g')
        .attr('clip-path', 'url(#axes-clip)');

    axes.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

    axes.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Time (s)');
}

function drawPaths(svg, data, x, y, z) {
    var upperOuterArea = d3.area()
        .x(function (d) {
            return x(d.date) || 1;
        })
        .y0(function (d) {
            return y(d.pct95);
        })
        .y1(function (d) {
            return y(d.pct75);
        });

    var upperInnerArea = d3.area()
        .x(function (d) {
            return x(d.date) || 1;
        })
        .y0(function (d) {
            return y(d.pct75);
        })
        .y1(function (d) {
            return y(0);
        });

    svg.datum(data);

    svg.append('path')
        .attr('class', 'area upper outer')
        .attr('d', upperOuterArea)
        .attr('fill', function (d) {
            return z('pct75')
        })
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'area upper inner')
        .attr('d', upperInnerArea)
        .attr('fill', function (d) {
            return z('pct95')
        })
        .attr('clip-path', 'url(#rect-clip)');

}

function createLegend(mainDiv, barsInfo, colorRange) {
    var z = d3.scaleOrdinal()
        .range(colorRange);
    var mainDivName = mainDiv.substr(1, mainDiv.length);
    $(mainDiv).after("<div id='Legend_" + mainDivName + "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>");
    var keys = Object.keys(barsInfo);
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