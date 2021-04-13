import React, { PureComponent } from "react";

export default function Index() {
  return (
    <>
      {React.createElement(
        "div",
        { className: "box" },
        React.createElement(
          "div",
          { className: "item" },
          "test"
        ),
        React.createElement(React.Fragment, null, " Flagment "),
        "text文本"
      )}
    </>
  );
}
