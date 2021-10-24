// const a = { val: 'a' }
// const b ={val:'b'}
// const c = {val:'c'}
// const d = {val:'d'}
// a.next = b;
// b.next= c;
// c.next = d;

// let p = a;
// while(p){
//   console.log(p.val)
//   p=p.next
// }

class LinkList {
  constructor() {
    this.length = 0;
    this.head = null;
  }
  // 返回索引对应的元素
  getElementAt(position) {
    if (position < 0 || position >= this.length) return null;
    let p = 0;
    let res = this.head;
    while (p < position) {
      res = res.next;
      p = p + 1;
    }
    return res;
  }
  // 添加节点
  append(element) {
    const last = this.getElementAt(this.length - 1);
    if (last) {
      last.next = element;
    } else {
      this.head = element;
    }
    this.length++;
    return this;
  }
  // 指定位置添加节点
  insert(position, element) {
    if (position < 0 || position > this.length) return false;
    const positionPreNode = this.getElementAt(position - 1);
    const positionNode = this.getElementAt(position);
    positionPreNode.next = element;
    element.next = positionNode;
    this.length++;
    return this;
  }
  // 删除指定位置元素
  removeAt(position) {
    if (position < 0 || position > this.length) return false;
    const positionPreNode = this.getElementAt(position - 1);
    const positionPostNode = this.getElementAt(position + 1);
    positionPreNode.next = positionPostNode;
    this.length--;
    return this;
  }
  // 查找给定元素索引
  indexOf(element) {
    let p = 0;
    let res = this.head;
    while (res) {
      if (res === element) {
        return p;
      }
      res = res.next;
      p = p + 1;
    }
    return -1;
  }
}

const linkList = new LinkList();

linkList.append({
  val: 1,
  next: null,
});

linkList.append({
  val: 2,
  next: null,
});
console.log("linkList", linkList);
const node = linkList.getElementAt(1);
console.log("node", node);

const index = linkList.indexOf(node);
console.log("index", index);

// linkList.insert(1, {
//   val: 3,
//   next: null,
// });

// linkList.removeAt(2);

// console.log(linkList);
// console.log("node", node);
