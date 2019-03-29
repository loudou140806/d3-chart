import React, { Component } from 'react';
import data from './data';
import DriftD3 from './drift'
import './index.css'

class Drift extends Component {
    componentDidMount() {
        new DriftD3({
            id: '#drift',
            data: data,
            width: 600,
            height: 300,
            legend: true
        })
    }
    
    render() {
        return (
            <div id='drift'></div>
        );
    }
}

export default Drift;