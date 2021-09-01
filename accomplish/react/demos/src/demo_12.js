import React,{useEffect} from 'react'

function Child() {
  useEffect(() => {
    console.log('Child');
  }, [])
  return <h1>child</h1>;
}
    
function Father() {
  useEffect(() => {
    console.log('Father');
  }, [])
      
  return <Child/>;
}
    
export default function App() {
  useEffect(() => {
    console.log('App');
  }, [])
    
  return <Father/>;
}