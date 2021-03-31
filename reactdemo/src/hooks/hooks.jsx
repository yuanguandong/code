import React from "react";

export default function Index() {
  const [num, setNumber] = React.useState(0);
  const handerClick = () => {
    setTimeout(() => {
      setNumber(num + 1);
      console.log(num);
    }, 1000);
    setTimeout(() => {
      setNumber(num + 1);
      console.log(num);
    }, 1000);
    setTimeout(() => {
      setNumber(num + 1);
      console.log(num);
    }, 1000);
    setTimeout(() => {
      setNumber(num + 1);
      console.log(num);
    }, 1000);
    setTimeout(() => {
      setNumber(num + 1);
      console.log(num);
    }, 1000);
  };
  return <button onClick={handerClick}>{num}</button>;
}
