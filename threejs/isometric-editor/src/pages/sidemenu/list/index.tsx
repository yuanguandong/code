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

  const handleItemClick = useCallback((key: string) => {
    switch (key) {
      case "cube":
        engine.sceneController.controller.action?.addCube({
          x: -9,
          z: 7,
        });
        break;
      case "cylinder":
        engine.sceneController.controller.action?.addCylinder({
          x: -9,
          z: 7,
        });
        break;
      case "text":
        engine.sceneController.controller.action?.addText({
          x: -9,
          z: 7,
          content: "Default Text",
          color: "#000000",
          fontSize: 0.2,
          fontWeight: "bold",
        });
        break;
      case "area":
        engine.sceneController.controller.action?.addArea({
          x: -9,
          z: 7,
          width: 3,
          length: 3,
          color: "#E6E7E8",
        });
        break;
    }
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
