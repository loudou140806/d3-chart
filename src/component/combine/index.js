import React, {
  Component,
  Fragment
} from "react";
import CombineD3 from "./combine";
import data from "./data";
import "./index.css";
import $ from 'jquery';

class index extends Component {
  componentDidMount() {

    $("#combine").empty();
    var combineConfig = {
      id: "#combine",
      data: data,
      width: 600,
      height: 300,
      legend: true
    };
    var combine3DConfig = {
      ...combineConfig,
      dimensions: '3d',
      id: '#combine3d'
    }

    new CombineD3(combineConfig);
    new CombineD3(combine3DConfig);
  }
  render() {
    return <Fragment>
      <div id = "combine" > </div>
      <div id = "combine3d" > </div>
    </Fragment>
  }
}

export default index;