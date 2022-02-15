# 低代码技术

> 目前是一个风口的方向

## 细节

1、low-code & no-code

### low-code

> 前端开发 = 视图 + 行为 + 辅助（脚手架、说白了各种轮子...）

比如说，开发一个 CRUD 页面？

```jsx
import { CRUD } from '@biz/crud';
<CRUD />
```

`建模`

视图语言 <-> 数据语言

打散 -- 页面建模（原子粒度 = 页面 + 行为） -> 不再写 `React` || `Vue` 代码，也没有组件库！！！

👇

> 提供一种中间的语言（DSL）来描述视图（页面的渲染）、行为（业务逻辑）

1、不需要去写那种命令式的业务逻辑
2、甚至不需要写 JS 代码
3、不需要去处理布局、样式
4、不需要引入组件库去写页面

`low-code`~

`low-code -> no-code -> AI`

--> `figma2code`

用什么呢？

`JSON` <-> `JS Object`

`VDOM`

> 用 JSON/对象/YAML 去描述视图结构/交互行为 -> 前端领域的低代码技术

```json
{
  "type": "curd",
  "service": {
    "api": "https://www",
    "method": "get",
    "message": "请求成功"
  },
  "form": [],
  "table": {}
}
```

`amis` - 百度 FEX 团队出的开源的低代码的渲染引擎

`tailwindCSS`


## no-code

> 一行代码都不写，还能完成产品可爱的需求
> AI: 啥事儿也没有 `img2code`

可视化搭建：拖拽组件，拼接成页面，配置相关属性或行为（业务逻辑），然后一键部署。

一定是需要一个数据结构来描述整个页面的信息的，存的其实是这个数据


手绘风格的网站

https://excalidraw.com/

```jsx
// vue / react
// v-dom(object) -> schedular | diff | patch -> createElement() -> view

// low-code engine
<YourComponent {...schema}/>

{
  type: 'form',
  contorls: {
    filters: [
      {
        type: 'select',
        placeholder: '请输入城市名称',
        validate: ['required'],
        name: 'cityId'
      },
      {
        type: 'select',
        placeholder: '请输入银行名称',
        validate: ['required'],
        name: 'bankId'
      }
    ]
  },
  table: {

  }
}
```
