import React, {useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

function WrapComponent({ children }) {
  const domRef = useRef(null);
  const [PortalComponent, setPortalComponent] = useState(null);

  useEffect(() => {
    setPortalComponent(ReactDOM.createPortal(children, domRef.current));
  }, []);

  return (
    <div>
      <div className="container" ref={domRef}>11</div>
      {PortalComponent}
    </div>
  );
}

export default class Index extends React.Component {
  render() {
    return (
      <div style={{ marginTop: "50px" }}>
        <WrapComponent>
          <div>hello,world</div>
        </WrapComponent>
      </div>
    );
  }
}
