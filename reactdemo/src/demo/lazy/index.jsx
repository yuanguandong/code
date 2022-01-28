import React, { PureComponent } from "react";
import lazy from './hook'
import Test from "./Test";
const LazyComponent = React.lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          default: () => <Test />,
        });
      }, 2000);
    })
    // import('./Test')
);

// const LazyComponent2 = lazy(()=>import('./Test.jsx'))

export default class index extends React.Component {
  render() {
    return (
      <div className="context_box" style={{ marginTop: "50px" }}>
        <React.Suspense fallback={<div className="icon">loading</div>}>
          <LazyComponent />
          {/* <LazyComponent2/> */}
        </React.Suspense>
      </div>
    );
  }
}
