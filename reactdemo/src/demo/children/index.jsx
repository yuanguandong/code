import React from "react";

class Text extends React.Component {
  render() {
    return <div>hello,world</div>;
  }
}

function WarpComponent(props) {
  console.log("props.children", props.children);
  // map
  // const newChildren = React.Children.map(props.children,(item)=>item)
  // console.log(newChildren)
  // return newChildren
  //only
  try {
    const childrenOnly = React.Children.only(props.children);
    console.log("childrenOnly", childrenOnly);
  } catch (error) {
    console.log(error);
  }

  //count
  const childrenCount = React.Children.count(props.children);
  console.log("childrenCount", childrenCount);

  //array
  const newChidrenArray = React.Children.toArray(props.children);
  console.log("newChidrenArray", newChidrenArray);

  // forEach
  React.Children.forEach(props.children, (item) => console.log(item));
  return props.children;
}

export default function Index() {
  return (
    <div style={{ marginTop: "50px" }}>
      <WarpComponent>
        {new Array(3).fill(0).map((i, index) => (
          <Text key={index} />
        ))}
        <span>hello,world</span>
      </WarpComponent>
    </div>
  );
}
