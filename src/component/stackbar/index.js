import React, { Component, Fragment } from "react";
import data from "./data";
import StackBarD3 from "./stackbar";
import './index.css'
class index extends Component {
  componentDidMount() {
    new StackBarD3({
      id: '#stackBar',
      width: 600,
      height: 300,
      data: data
    })
    
    new StackBarD3({
      id: '#stackBar3d',
      width: 600,
      height: 300,
      data: data,
      dimensions: '3d'
    })
  }

  render() {
    return (
      <Fragment>
        <div id="stackBar"></div>
        <div id="stackBar3d"></div>
      </Fragment>
    );
  }
}

export default index;
