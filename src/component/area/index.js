import React, { Component } from 'react';
import AreaD3 from './area'
import data from './data'

class Area extends Component {
    componentDidMount() {
        new AreaD3({
            id: "#area",
            width: 600,
            height: 300,
            data: data
        });
    }
    
    render() {
        return (
            <div id="area"></div>
        );
    }
}

export default Area;