import React, { Component, Fragment } from "react";
import "./index.css";
import ColumnD3 from "./column";
import data from "./data";

class index extends Component {
  componentDidMount() {
    new ColumnD3({
      id: "#column",
      data: data,
      width: 600,
      height: 300,
    });
    new ColumnD3({
      id: "#column3d",
      data: data,
      width: 600,
      height: 300,
      dimensions: '3d'
    });
  }
  render() {
    return <Fragment>
    <div className="dviz" id="column" />
    <div className="dviz" id="column3d" />
    </Fragment>
  }
}

export default index;
