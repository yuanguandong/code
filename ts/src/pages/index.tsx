import styles from './index.less';
import { enableCache, measure } from '@/utils';

class Obj {
  @measure
  @enableCache
  create(params: any) {
    console.log('create');
  }
}
const obj = new Obj();
obj.create(1);

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
