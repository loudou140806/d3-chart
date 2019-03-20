import React, { Component } from "react";
import * as d3 from "d3";
import Donut3D from "./pie";
import "./index.less";

class index extends Component {
  componentDidMount() {
    var salesData = [
      { label: "Basic", color: "#3366CC" },
      { label: "Plus", color: "#DC3912" },
      { label: "Lite", color: "#FF9900" },
      { label: "Elite", color: "#109618" },
      { label: "Delux", color: "#990099" }
    ];

    var svg = d3
      .select("#pie")
      .append("svg")
      .attr("width", 300)
      .attr("height", 300);

    svg.append("g").attr("id", "quotesDonut");

    Donut3D("quotesDonut", randomData(), 150, 150, 130, 100, 30, 0.2);

    // function changeData() {
    //   Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
    // }

    function randomData() {
      return salesData.map(function(d) {
        return { label: d.label, value: 1000 * Math.random(), color: d.color };
      });
    }
  }

  render() {
    return <div id="pie"></div>;
  }
}

export default index;
