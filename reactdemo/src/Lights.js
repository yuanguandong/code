import React, { useState, useEffect } from "react";
import "./App.css";

function Light(props) {
  const { lights, duration = 5000, twinkleDuration = 3000 } = props;
  let [light, setLight] = useState([lights[0]]);
  const handleClick = () => {};

  const twinkle = async (light, resolve) => {
    const timmer = setInterval(() => {
      setLight((l) => {
        if (l !== "#ddd") {
          return "#ddd";
        } else {
          return light;
        }
      });
    }, 300);
    setTimeout(() => {
      clearInterval(timmer);
      resolve();
    }, twinkleDuration);
  };

  const handleLight = async (light, time) => {
    setLight(light);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        twinkle(light, resolve);
      }, time);
    });
  };

  useEffect(() => {
    (async () => {
      async function circle() {
        for (let i of lights) {
          await handleLight(i, duration);

          if (i === lights[lights.length - 1]) {
            circle();
          }
        }
      }
      circle();
    })();
  }, []);

  return (
    <div
      onClick={handleClick}
      style={{
        fontSize: 40,
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: light,
        border: "1px solid #ddd",
      }}
    ></div>
  );
}

function App() {
  const AllLights = [
    {
      lights: ["red", "yellow", "green"],
      duration: 5000,
      twinkleDuration: 3000,
    },
    {
      lights: ["black", "blue"],
      duration: 3000,
      twinkleDuration: 1000,
    },
  ];

  return (
    <>
      {AllLights.map((o) => (
        <Light {...o} />
      ))}
    </>
  );
}

export default App;
