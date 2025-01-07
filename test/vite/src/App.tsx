"use client";

import type { ClickParams, ICraftPlayerInstance } from "@icraft/player-react";
import { ICraftPlayer } from "@icraft/player-react";
import { useCallback, useRef } from "react";

export default function CraftPlayer() {
  const instanceRef = useRef<ICraftPlayerInstance>();

  const onClick = useCallback((params: ClickParams) => {
    console.log("onClick", params);

    const allSceneElements = instanceRef.current?.getAllSceneElementsData();
    const currentSceneElements = instanceRef.current?.getCurrentSceneElements();
    console.log("allSceneElements", allSceneElements);
    console.log("currentSceneElements", currentSceneElements);
  }, []);

  const onReady = () => {
    const elements = instanceRef.current?.getCurrentSceneElements();
    console.log("elements", elements);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ICraftPlayer
        src='/AWSCloud.iplayer'
        onClick={onClick}
        ref={instanceRef}
        onReady={onReady}
        addons={["CameraBar", "PlayerBar", "EnterSubScene", "ZoomBar", "ExitSubScene"]}
      />
    </div>
  );
}
