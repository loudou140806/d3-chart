export default {
  xAxis: {
    title: 'x-axis-title'
  },
  yAxis: [{
    title: 'y-axis-title'
  },{
    title: 'y1-axis-title'
  },
],
  category: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  series: [{
    name: 'series1',
    type: 'column',
    data: [8, 7, 4, 19, 3, 12, 4, 5, 2, 10]
  }, {
    name: 'series2',
    type: 'line',
    data: [2, 1, 14, 9, 13, 12, 4, 15, 2, 5]
  }]
}