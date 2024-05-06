import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutsIF } from 'react-dashboard-pro';
// import Dashboard from '../../../lib';
import Dashboard from 'react-dashboard-pro';
import allWidgets from '../widgets';

function myNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

var a = 10;
(function () {
  console.log(a);
  a = 5;
  console.log(window.a);
  var a = 20;
  console.log(a);
})();

export default () => {
  const handleClick = () => {
    console.log('click');
  };

  const handleChange = (v) => {
    console.log(get(obj, 'b.c.d[2]'));
  };

  useEffect(() => {}, []);

  return (
    <>
      <input onChange={handleChange} />
      <div onClick={handleClick}>111111</div>
    </>
  );
};
