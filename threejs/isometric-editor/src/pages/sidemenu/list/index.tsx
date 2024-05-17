import { List } from "antd";
import styles from "./index.less";
import { useCallback } from "react";
import { useEngine } from "@/engine";
import { ElementData } from "@/engine/interface";

interface ElementListProps {
  data: { key: string; name: string }[];
}

export default function ElementList(props: ElementListProps) {
  const { data } = props;
  const engine = useEngine();

  const handleItemClick = useCallback((key: string) => {
    engine.controller.elements?.createElement(key);
  }, []);

  return (
    <List
      size='small'
      bordered={false}
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          className={styles.listItem}
          onClick={handleItemClick.bind(null, item.key)}
        >
          {item.name}
        </List.Item>
      )}
    />
  );
}
