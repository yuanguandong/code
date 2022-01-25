import React, { useState, useEffect } from "react";

export default function lazy(loadComponent) {
  const [Component, setComponent] = useState(() => Fallback);
  const Fallback = () => <h1></h1>;

  useEffect(() => {
    loadComponent().then((res) => {
      setComponent(res.default);
    });
  }, []);

  return <Component />;
}
