import { useEngine } from "@/engine";
import styles from "./index.less";
import { Collapse, Typography } from "antd";
const { Title } = Typography;
import { useLayoutEffect, useRef } from "react";

export default function HomePage() {
  const ref = useRef<HTMLDivElement>(null);
  const engine = useEngine();

  useLayoutEffect(() => {
    const container = ref.current;
    if (container) {
      engine.initDom(container)
      engine.sceneController.controller.post?.initPostRender()
    }
  }, []);

  return (
    <div
      className={styles.main}
      ref={ref}
    >
    </div>
  );
}
