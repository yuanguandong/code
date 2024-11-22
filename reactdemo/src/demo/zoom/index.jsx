import classnames from 'classnames'
import React, { useEffect } from 'react'
import './index.css'


export default ()=>{

  // useEffect(() => {
  //   if () {
  //     document.body.classList.add('global-export-start');
  //   } else {
  //     document.body.classList.remove('global-export-start');
  //   }
  // }, []);

  useEffect(()=>{
    const zoom = document.body.querySelectorAll('.zoom')
    zoom.forEach(()=>{})
    debugger
  },[])

  return <>
    <div className={classnames('zoom','box1')}>1</div>
    <div className={classnames('zoom','box2')}>2</div>
  </>
}