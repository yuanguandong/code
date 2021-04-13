import React, { useState, useEffect } from "react";
import "./App.css";

function Light(props) {
  const { lights, duration = 5000, twinkleDuration = 3000 } = props;
  let [light, setLight] = useState([lights[0]]);
  let [tick, setTick] = useState(false);

  const twinkle = async (resolve) => {
    setTick(true);
    setTimeout(() => {
      setTick(false);
      resolve();
    }, twinkleDuration);
  };

  const handleLight = async (light, time) => {
    setLight(light);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        twinkle(resolve);
      }, time);
    });
  };

  useEffect(() => {
    async function circle() {
      for (let i = 0; i < lights.length; i++) {
        let key = lights[i];
        await handleLight(key, duration);
        if (key === lights[lights.length - 1]) {
          circle();
        }
      }
    }
    circle();
  }, []);

  return (
    <div
      style={{
        fontSize: 40,
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: light,
        border: "1px solid #ddd",
        marginLeft: lights.indexOf(light) * 50,
      }}
      className={tick ? "tick" : ""}
    ></div>
  );
}

function App() {
  const AllLights = [
    {
      key:1,
      lights: ["red", "yellow", "green"],
      duration: 5000,
      twinkleDuration: 3000,
    },
    {
      key:2,
      lights: ["black", "blue"],
      duration: 3000,
      twinkleDuration: 1000,
    },
  ];

  return (
    <>
      {AllLights.map((o) => (
        <Light {...o} key={o.key}/>
      ))}
    </>
  );
}

export default App;
