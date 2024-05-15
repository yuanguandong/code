import { Link, Outlet } from "umi";
import styles from "./index.less";
import "./global.less";
import { Button } from "antd";
import { CodepenOutlined, PoweroffOutlined } from "@ant-design/icons";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.title}>
          <CodepenOutlined /> 3D轴侧场景编辑器
        </div>
        <div className={styles.toolbar}>
          <Button
            // type='primary'
            icon={<PoweroffOutlined />}
            size='small'
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
