import { List } from "antd";
import styles from "./index.less";
import { useCallback } from "react";
import { useEngine } from "@/engine";

interface ElementListProps {
  data: { key: string; name: string }[];
}

export default function ElementList(props: ElementListProps) {
  const { data } = props;
  const engine = useEngine();

  const handleItemClick = useCallback(() => {
    engine.sceneController.controller.action?.addCube({
      x: -9,
      z: 7,
    });
  }, []);

  return (
    <List
      size='small'
      bordered={false}
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          className={styles.listItem}
          onClick={handleItemClick}
        >
          {item.name}
        </List.Item>
      )}
    />
  );
}
