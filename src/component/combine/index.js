import React, {
  Component
} from "react";
import CombineD3 from "./combine";
import groupChartData from "./data";
import "./index.scss";
import $ from 'jquery';

class index extends Component {
  componentDidMount() {
    $("#combine").empty();
    var barChartConfig = {
      mainDiv: "#combine",
      colorRange: ["#2a98cd", "#df7247"],
      data: groupChartData,
      columnsInfo: ['series1', 'series2'],
      xAxis: "over",
      yAxis: "runs",
      width: 600,
      height: 300,
      label: {
        xAxis: "Over",
        yAxis: ["y-axis1","y-axis2"]
      },
      requireLegend: true
    };
    new CombineD3(barChartConfig);
  }
  render() {
    return <div id="combine"></div>;
  }
}

export default index;