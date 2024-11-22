const data = [{
  x: 'price',
  y: [0, 490500],
  color:'#1A7A93'
},
{
  x: 'commercial policy',
  y: [400000, 490500],
  color:'#1A7A93'
},
{
  x: 'VA',
  y: [300000, 400000],
  color:'#1A7A93'

},
{
  x: 'VA Tax',
  y: [350000, 400000],
  color:'#1A7A93'

},
{
  x: 'Top Down Material Cost Target',
  y: [0, 200000],
  color:'#123D7B'
},
{
  x: 'Top Down Material Cost Target',
  y: [200000, 300000],
  color:'#174FA3'
},
{
  x: 'Top Down Material Cost Target',
  y: [300000, 350000],
  color:'#1E8EC8'
},
{
  x: 'Top Down Material Cost Target',
  y: [350000, 370000],
  color:'#808080'
},
{
  x: 'Gap',
  y: [400000, 402000],
  color:'#f00'

},
{
  x: 'configuration difference',
  y: [402000, 422000],
  color:'#f00'

},
{
  x: '3% Annual cost reduction',
  y: [422000, 432000],
  color:'#1A7A93'
},
{
  x: 'Bottom up Material Cost Target QG9',
  y: [0, 200000],
  color:'#123D7B'
},
{
  x: 'Bottom up Material Cost Target QG9',
  y: [200000, 300000],
  color:'#174FA3'
},
{
  x: 'Bottom up Material Cost Target QG9',
  y: [300000, 350000],
  color:'#1E8EC8'
},
{
  x: 'Bottom up Material Cost Target QG9',
  y: [350000, 420000],
  color:'#808080'
},
];

const chart = new G2.Chart({
  container: 'container',
  autoFit: true,
  height: 600,
  // color:'color'
});

chart.data(data);
chart.scale('y', {
  nice: true
});

// chart.axis('x',true)
chart.axis('x', {
  title: {
    autoRotate:true
  },
  label:{
    autoRotate:true,
    autoHide:false,
    autoEllipsis:true
  }
});

chart.legend({
  custom:true,
  items:[{
    id:'Consumables',
    name:'Consumables',
    value:'Consumables',
    marker:{
      style:{
        fill:'#AEAEAE'
      }
    }
  },{
    id:'Entire Vehicle',
    name:'Entire Vehicle',
    value:'Entire Vehicle',
    marker:{
      style:{
        fill:'#7F7F7F'
      }
    }
  },{
    id:'E/E',
    name:'E/E',
    value:'E/E',
    marker:{
      style:{
        fill:'#7F7F7F'
      }
    }
  },{
    id:'Cab',
    name:'Cab',
    value:'Cab',
    marker:{
      style:{
        fill:'#1E8EC8'
      }
    }
  },{
    id:'Chassis',
    name:'Chassis',
    value:'Chassis',
    marker:{
      style:{
        fill:'#174FA3'
      }
    }
  },{
    id:'Powertrain',
    name:'Powertrain',
    value:'Powertrain',
    marker:{
      style:{
        fill:'#123D7B'
      }
    }
  }]
});

chart.tooltip({
  shared: true,
  showMarkers: false,
});
chart.interaction('element-active');


chart.interval().position('x*y').animate({
  appear: {
    animation: 'zoom-in'
  }
}).color('color', (color) => {
  return color
}).label('y', (val) => {
  return {
    position: 'middle',
    offset: 0,
    content: (originData) => {
      return originData.y[1]-originData.y[0]
    },
    style: {
      stroke: '#ccc'
    }
  };
})

chart.render();