/*
 * @Descripttion: 
 * @MainAuthor: 
 */
"use client";

import type { ClickParams, ICraftPlayerInstance } from "@icraft/player-react";
import { ICraftPlayer } from "@icraft/player-react";
import React from "react";
import { useCallback, useRef, useState } from "react";

export default function CraftPlayer() {
  const instanceRef = useRef<ICraftPlayerInstance>();
  const [activeKey, setActiveKey] = useState<string>("");

  const onClick = useCallback((params: ClickParams) => {
    const { instance } = params;
    instance?.setDisabled(!instance.isDisabled);
    setActiveKey(instance?.key || "");
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
    <React.StrictMode>
      <ICraftPlayer
        src='/ArgoCD1.iplayer'
        onClick={onClick}
        ref={instanceRef}
        onReady={onReady}
        addons={["CameraBar", "PlayerBar", "EnterSubScene", "ZoomBar", "ExitSubScene"]}
      />
    </React.StrictMode>
  );
}
