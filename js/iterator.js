
  function myIterator(list) {
    let length = list.length
    let i = 0
    return {
      next: function () {
        let down = i >= length
        let value = !down ? list[i++] : undefined
        return {
          value,
          down
        }
      }
    }
  }
  var arr = [1, 2, 3, 4, 5]
  const itList = myIterator(arr)
