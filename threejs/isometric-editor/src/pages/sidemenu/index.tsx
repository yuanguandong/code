import styles from "./index.less";
import { Collapse, CollapseProps, Input, List, Typography } from "antd";
const { Title } = Typography;

const { Search } = Input;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const data = [
  {
    key:'cube',
    name: "立方体",
  },
  {
    key:'cylinder',
    name: "圆柱体",
  },
  {
    key:'text',
    name: "文字",
  },
  {
    key:'plane',
    name: "平面",
  },
  {
    key:'icon',
    name: "图标",
  },
  {
    key:'image',
    name: "图片",
  },
];

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "通用",
    children: (
      <List
        size='small'
        // header={<div>Header</div>}
        // footer={<div>Footer</div>}
        bordered={false}
        dataSource={data}
        renderItem={(item) => <List.Item className={styles.listItem}>{item.name}</List.Item>}
      />
    ),
  },
  {
    key: "2",
    label: "高级",
    children: <p>{"暂无"}</p>,
  },
];

export default function HomePage() {
  return (
    <div className={styles.left}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Title level={5}>物体</Title>
        </div>
        <div className={styles.search}>
          <Search
            placeholder='搜索'
            // onSearch={onSearch}
            // style={{ width: 200 }}
          />
        </div>
      </div>
      <div className={styles.objectList}>
        <Collapse
          items={items}
          defaultActiveKey={["1"]}
          size='small'
          expandIconPosition='end'
          // onChange={onChange}
        />
      </div>
    </div>
  );
}
