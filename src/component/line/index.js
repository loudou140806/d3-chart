import React, { Component } from 'react';
import Lined3 from './line'
import data from './data'

class Line extends Component {
    componentDidMount() {
        new Lined3({
            id: '#line',
            data,
            svgWidth: 600,
            svgHeight: 300,
            legend: true
        })
    }
    
    render() {
        return (
            <div id='line'></div>
        );
    }
}

export default Line;