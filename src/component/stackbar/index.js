import React, { Component } from "react";
import data from "./data";
import StackBarD3 from "./stackbar";
class index extends Component {
  componentDidMount() {
    StackBarD3.draw(data)
  }

  render() {
    return (
      <div id="stackBar">
      </div>
    );
  }
}

export default index;
