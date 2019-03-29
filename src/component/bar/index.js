import React, {
  Component,
  Fragment
} from "react";
import "./index.css";
import BarD3 from "./bar";
import data from "./data";
import $ from "jquery"

class index extends Component {
  componentDidMount() {
    $("#bar").empty();
    var barChartConfig = {
      id: "#bar",
      colorRange: ["#2a98cd", "#df7247"],
      data: data,
      barsInfo: ['value'],
      xAxis: "value",
      yAxis: "month",
      width: 600,
      height: 300,
      label: {
        xAxis: "Value",
        yAxis: "Month"
      },
      requireLegend: true
    };
    var d3BarChartConfig = {
      ...barChartConfig,
      dimensions: '3d',
      id: "#bar3d"
    }
    new BarD3(barChartConfig);
    new BarD3(d3BarChartConfig);
  }
  render() {
    return <Fragment>
      <div className = "dviz" id = "bar"/>
      <div className = "dviz" id = "bar3d"/>
    </Fragment>
  }
}

export default index;