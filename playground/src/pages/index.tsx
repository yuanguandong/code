import React, { useRef, useState } from 'react';
import type { LayoutsIF } from 'react-dashboard-pro';
// import Dashboard from '../../../lib';
import Dashboard from 'react-dashboard-pro';
import allWidgets from '../widgets';
import test from './test';

export default () => {
  const ref = useRef<any>(null);
  const [layout, setLayout] = useState<LayoutsIF>([]);
  const onLayoutChange = (layout: LayoutsIF) => {
    setLayout(layout);
  };

  const time1 = performance.now();
  console.log(test.getList());
  const time2 = performance.now();
  console.log(time2 - time1);
  // const cuboid = test.getList()[0].cuboid;
  // cuboid.b = 555;
  // test.list[0] = '111';
  // console.log('test', test);
  return (
    <>
      1
      {/* <Dashboard
        widgets={allWidgets}
        // initialLayout={initialLayout}
        onLayoutChange={onLayoutChange}
        layout={layout}
        widgetWrapStyle={{
          borderRadius: 10,
          boxShadow: '0 3px 3px rgba(128,128,128,0.2)',
        }}
        ref={ref}
      /> */}
    </>
  );
};
