import styles from "./index.less";
import { Collapse, Typography } from "antd";
const { Title } = Typography;
import SideMenu from "./sidemenu";
import Scene from "./scene";
import ProtoPanel from "./protopanel";
import { engine } from "../engine";
import { useLayoutEffect } from "react";

export default function HomePage() {
  useLayoutEffect(() => {
    console.log("engine", engine);
  }, []);

  return (
    <div className={styles.container}>
      <SideMenu />
      <Scene />
      <ProtoPanel />
    </div>
  );
}
