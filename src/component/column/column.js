import * as d3 from "d3";
export default function ColumnD3 (data) {
  var margin = {
      top: 20,
      right: 20,
      bottom: 70,
      left: 40
    },
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
  // Parse the date / time
  var parseDate = d3.timeFormat("%Y-%m");

  var x = d3.scaleBand().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y).ticks(10);

  var svg = d3
    .select("#column")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function (d) {
    d.date = parseDate(new Date(d.date));
    d.value = +d.value;
  });

  x.domain(
    data.map(function (d) {
      return d.date;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.value;
    })
  ]);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom * 0.5)
    .attr("fill", "#000")
    .text("Month")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "1.8em")
    

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("fill", "#000")
    .attr("x", 0 - height / 2)
    .attr("y", 5 - margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("Value ($)");

  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", "steelblue")
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

  svg
    .selectAll(".barTop")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "barTop")
    .style("fill", function (d) {
      return d3.hsl('steelblue').brighter(0.7);
    })
    .style("stroke", function (d) {
      return d3.hsl('steelblue').brighter(0.7);
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
      return d3.hsl('steelblue').darker(0.7);
    })
    .style("stroke", function (d) {
      return "steelblue";
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
};
