import React, {
  Component, Fragment
} from "react";
import Donut3D from "./pie";
import "./index.css";
import data from './data';

class index extends Component {
  componentDidMount() {
    new Donut3D({
      id: "#pie",
      data: data,
      x: 150,
      y: 150,
      rx: 130,
      ry: 100,
      h: 30,
      ir: 0.2,
      legend: true,
    });

    new Donut3D({
      id: "#pie3D",
      data: data,
      dimensions: '3d',
      x: 150,
      y: 150,
      rx: 130,
      ry: 100,
      h: 30,
      ir: 0.2,
      legend: true,
    });
  }

  render() {
    return (<Fragment>
      <div id="pie"> </div>
      <div id="pie3D"> </div>
    </Fragment>)
  }
}

export default index;