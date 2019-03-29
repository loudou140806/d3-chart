import React, { Component } from 'react';
import data from './data';
import ScatterD3 from './scatter'

class Scatter extends Component {
    componentDidMount() {
        new ScatterD3({
            id: '#scatter',
            data: data,
            width: 600,
            height: 300,
            legend: true
        })
    }
    
    render() {
        return (
            <div id='scatter'></div>
        );
    }
}

export default Scatter;