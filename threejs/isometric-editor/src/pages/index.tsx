import styles from "./index.less";
import { Collapse, Typography } from "antd";
const { Title } = Typography;
import SideMenu from "./sidemenu";
import Scene from "./scene";
import ProtoPanel from "./protopanel";
import { engine } from "../engine";
import { useLayoutEffect } from "react";
import { useKeyPress } from "ahooks";
import useKeyPressEffect from "./useKeyPress";

export default function HomePage() {
  console.log('engine',engine)
  useKeyPressEffect();

  return (
    <div className={styles.container}>
      <SideMenu />
      <Scene />
      <ProtoPanel />
    </div>
  );
}
