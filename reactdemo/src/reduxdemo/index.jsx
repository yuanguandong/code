import React from "react";
import connect from "./connect";

const Page = function (props) {
  const { count = 0, dispatch = () => {} } = props;
  console.log("count", count);
  return (
    <>
      <div id="counter">count:{count}</div>
      <button
        id="addBtn"
        onClick={() => {
          dispatch({ type: "countReducer/INCREMENT" });
        }}
      >
        addBtn
      </button>
      <button
        id="minusBtn"
        onClick={() => {
          dispatch({ type: "countReducer/DECREMENT" });
        }}
      >
        minusBtn
      </button>
    </>
  );
};

// const connectedPage = connect((props) => ({ count: props.count }))(Page);
const connectedPage = connect(({ count }) => ({ count }))(Page);

export default connectedPage;
// export default Page;
