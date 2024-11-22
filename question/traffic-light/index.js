const LIGHTS = [{color:'#f00',delay:2000},{color:'blue',delay:2000},{color:'yellow',delay:2000},{color:'#000',delay:2000}]

const sleep = function(delay){
  return new Promise((resolve,reject)=>{
    setTimeout(resolve, delay)
  })
}

const doLight = async(color,time)=>{
  const light = document.getElementById('light')
  light.style.background = color
  await sleep(time)
}


const trafficLight = async()=>{
  for(let item of LIGHTS){
    const {color,delay} = item
    await doLight(color,delay)
  }
  trafficLight()
}

trafficLight()


