import data from './data';
import { cloneDeep } from 'lodash';

class Test {
  #list: any[] = [{ id: 1, cuboid: data }];
  constructor() {}

  getList = () => {
    return cloneDeep(this.#list);
    return JSON.parse(JSON.stringify(this.#list));
  };

  setList = (index, value) => {
    this.#list[index] = value;
  };
  // private list = [];
}

const test = new Test();
export default test;
