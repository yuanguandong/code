import React, { useState, useEffect } from "react";

const  Lazy=(loadComponent) =>{
  const [Component, setComponent] = useState(() => Fallback);
  const Fallback = () => <h1>loading……</h1>;

  useEffect(() => {
    loadComponent().then((res) => {
      setComponent(res.default);
    });
  }, []);

  return <Component />;
}

export default  Lazy