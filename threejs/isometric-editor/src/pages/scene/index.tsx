import { useEngine } from "@/engine";
import styles from "./index.less";
import { Collapse, Typography } from "antd";
const { Title } = Typography;
import { useLayoutEffect, useRef, useState } from "react";
import { useLocalStorageState } from "ahooks";

export default function Scene() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const engine = useEngine();

  const [elementsData, setElementsData] = useLocalStorageState<Record<string, any>[]>("elements", {
    defaultValue: [
      {
        type: "cube",
        options: {
          x: 0,
          z: 0,
        },
      },
    ],
  });

  useLayoutEffect(() => {
    const container = ref.current;
    if (container && !ready) {
      engine.initDom(container);
      engine.sceneController.controller.post?.initPostRender();
      engine.sceneController.controller.initData(elementsData);
      setReady(true);
    }
  }, []);

  return (
    <div
      className={styles.main}
      ref={ref}
    />
  );
}
