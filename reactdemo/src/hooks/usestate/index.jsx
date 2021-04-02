//定义useState
const React = (function(){
  let _val
  return {
      useState(initValue){
          _val = _val || initValue
          function setVal(value){
              _val = value
          }
          return [_val, setVal]
      }
  }
})()

//使用
export default function Counter(){
  const [count,setCount] = React.useState(0)

  return <button onClick={()=>setCount(count+1)}>{count}</button>

  // return{
  //     getCount:()=>console.log(count),
  //     setCount:()=>setCount(count+1)
  // }

}

// Counter().getCount() // 0
// Counter().setCount() 
// Counter().getCount() // 1
