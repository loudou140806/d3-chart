import React, { Component } from 'react';
import './App.css';
import Pie3d from './component/pie'
import Column3d from './component/column'
import StackBar3d from './component/stackbar'
import Combine3d from './component/combine/'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Pie3d/>
        <Column3d/>
        <StackBar3d/>
        <Combine3d/>
      </div>
    );
  }
}

export default App;
