import { EditOutlined, RiseOutlined, StockOutlined } from "@ant-design/icons";
import { Space, Button, Tooltip } from "antd";
import styles from "./index.less";
import { useEngine } from "@/engine";
import { useStore } from "@/components/store/useStore";
import { isEmpty } from "lodash";

export const EditBar = () => {
  const engine = useEngine();
  const [{ activeElementKeys, editbarPosition }] = useStore(engine.controller.setting.store, [
    "activeElementKeys",
    "editbarPosition",
  ]);


  if (isEmpty(activeElementKeys)) {
    return null;
  }

  return (
    <Space
      direction='vertical'
      className={styles.editbar}
      style={{
        top: editbarPosition.y,
        left: editbarPosition.x,
      }}
    >
      <Tooltip title='search'>
        <Button
          type='primary'
          shape='circle'
          icon={<RiseOutlined />}
        />
      </Tooltip>
      <Tooltip title='search'>
        <Button
          type='primary'
          shape='circle'
          icon={<StockOutlined />}
        />
      </Tooltip>
      <Tooltip title='search'>
        <Button
          type='primary'
          shape='circle'
          icon={<EditOutlined />}
        />
      </Tooltip>
    </Space>
  );
};
