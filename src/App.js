import React, { Component } from 'react';
import './App.css';
import Pie3d from './component/pie'
import Column3d from './component/column'
import StackBar3d from './component/stackbar'
import Combine3d from './component/combine/'
import Bar3d from './component/bar'
import Area from './component/area'
import Line from './component/line'
import Scatter from './component/scatter'
import Drift from './component/drift'
class App extends Component {
  render() {
    return (
      <div className="App">
        <Pie3d/>
        <Column3d/>
        <Bar3d/>
        <StackBar3d/>
        <Combine3d/>
        <Area/>
        <Line/>
        <Scatter/>
        <Drift/>
      </div>
    );
  }
}

export default App;
