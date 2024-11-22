class MinHeap{
  constructor(){
    this.heap = []

  }
  getParentIndex(i){
    return (i-1)/2
  }
  shiftUp(index){

  }
  insert(value){
    this.heap.push(value)
    this.shiftUp(this.heap.length - 1)
  }
}