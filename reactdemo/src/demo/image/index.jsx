import PhotoViewer from "photoviewer";
import "photoviewer/dist/photoviewer.css";
import React from "react";

const MyComponent = () => {
  const view = () => {
    const items = [
      {
        src: "/logo192.png",
        title: "Image Caption 1",
      },
      {
        src: "/logo512.png",
        title: "Image Caption 2",
      },
    ];
    const options = {
      index: 0,
    };
    const viewer = new PhotoViewer(items, options);
  };
  return <button onClick={view}>111</button>;
};

export default MyComponent;
