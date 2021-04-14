import React from "react";

const Text = React.createFactory(() => <div>hello,world</div>);

export default function Index() {
  return (
    <div style={{ marginTop: "50px" }}>
      <Text />
    </div>
  );
}
