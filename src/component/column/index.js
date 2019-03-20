import React, { Component } from "react";
import "./index.less";
import ColumnD3 from "./column";
import data from "./data";

class index extends Component {
  componentDidMount() {
    ColumnD3(data);
  }
  render() {
    return <div className="dviz" id="column" />;
  }
}

export default index;
