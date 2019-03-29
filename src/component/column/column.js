import * as d3 from "d3";
export default function ColumnD3(config) {
  var id = config.id,
    svgWidth = config.width,
    svgHeight = config.height,
    rawData = config.data,
    dimensions = config.dimensions,
    margin = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40
    },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

  var parseDate = d3.timeFormat("%Y-%m");
  var data = rawData.series.map(function (d) {
    return {
      date: parseDate(new Date(d.date)),
      value: +d.value
    }
  });

  var x = d3.scaleBand().range([0, width]).domain(
    data.map(function (d) {
      return d.date;
    })
  );
  var yMin = d3.min(data, function (d) {
    return d.value
  })
  var yMax = d3.max(data, function (d) {
    return d.value;
  })
  var y = d3.scaleLinear().range([height, 0]).domain([yMin, yMax]);
  var z = d3.scaleOrdinal(d3.schemeCategory10)

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y).ticks(10);

  var svg = d3
    .select(`${id}`)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 15)
    .attr("fill", "#000")
    .text(rawData.xAxis.title)
    .style("text-anchor", "middle")

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("fill", "#000")
    .attr("x", 0 - height / 2)
    .attr("y", 5 - margin.left)
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text(rawData.yAxis.title);

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", function (d) {
      return z(d)
    })
    .attr('class', 'bar')
    .attr("x", function (d) {
      return x(d.date) + 10;
    })
    .attr("width", x.bandwidth() - 20)
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("height", function (d) {
      return height - y(d.value);
    });
  if (dimensions === '3d' || dimensions === '3D') {
    svg
      .selectAll(".barTop")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "barTop")
      .style("fill", function (d) {
        return d3.hsl(z(d)).brighter(0.7);
      })
      .style("stroke", function (d) {
        return d3.hsl(z(d)).brighter(0.7);
      })
      .attr("d", function (d) {
        return `M 
          ${x(d.date) + 10} 
          ${y(d.value)} 
          L 
          ${x(d.date) + 22.5}  
          ${y(d.value) - 12.5}
          L
          ${x(d.date) + 47.5}
          ${y(d.value) - 12.5}
          L
          ${x(d.date) + 35}
          ${y(d.value)}
          Z
          `;
      });

    svg
      .selectAll(".barRight")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "barRight")
      .style("fill", function (d) {
        return d3.hsl(z(d)).darker(0.7);
      })
      .style("stroke", function (d) {
        return d3.hsl(z(d)).darker(0.7);;
      })
      .attr("d", function (d) {
        return `M
          ${x(d.date) + 35}
          ${y(d.value)} 
          L
          ${x(d.date) + 47.5} 
          ${y(d.value) -12.5} 
          L
          ${x(d.date) + 47.5}
          ${height - 12.5}
          L
          ${x(d.date) + 35}
          ${height}
          Z
          `;
      });
  }

};