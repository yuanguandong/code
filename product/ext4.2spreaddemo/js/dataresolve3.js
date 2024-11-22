

//获取标签列的索引
const getDynmicColumnIndex = (data, sheetName, tag) => {
  let dynamicColumnsIndex = []
  const columnDataArray = data.sheets[sheetName].data.columnDataArray
  // const dataTable = data.sheets[sheetName].data.dataTable
  columnDataArray.forEach((item, index) => {
    if (!_.isEmpty(item) && item.tag === tag) {
      dynamicColumnsIndex.push(index)
    }
  })
  return dynamicColumnsIndex[0]
}

//验证是否是数据绑定的单元格
const testBindValue = (value) => {
  var reg = /\[(.+?)\]/g
  if (typeof (value) == 'string' && value.match(reg)) {
    return true
  } else {
    return false
  }
}

const getFiled = (value) => {
  let result = ''
  if (typeof (value) == 'string') {
    result = value.replace('[', '').replace(']', '')
  }
  return result
}

//获取绑定的真实value
const getBindValue = (data, value, currentIndex) => {
  let result = value
  const field = getFiled(value)
  if (data[currentIndex][field]) {
    result = data[currentIndex][field]
  }
  return result
}

//计算公式(N.与最低报价的差额占最低报价的百分比)
const calcFormula = (data, column, dynmicColumnIndex) => {
  let groups = _.groupBy(data, 'times')
  const currentIndex = column - dynmicColumnIndex
  const item = data[currentIndex]
  let currentGroup = groups[item['times']]
  let currentGroupIndex = 0
  Object.keys(groups).map((key, index, arr) => {
    if (key === item['times']) {
      currentGroupIndex = index
    }
  })
  console.log('currentGroupIndex', currentGroupIndex)
  const startC = dynmicColumnIndex + currentGroupIndex * currentGroup.length
  console.log('startC', startC)
  let collection = ''
  for (let i = startC; i < startC + currentGroup.length; i++) {
    collection += `R[-2]C${i + 1},`
  }
  collection = collection.slice(0, collection.length - 1)
  const formula = `(
    R[-2]C
    -
    MIN(${collection})
  )
  /
  MIN(${collection})`
  return formula
}


//是否当次轮次最低
const isMinInThisTimes = (value, sheet, row, column, dynmicColumnIndex, data) => {
  let groups = _.groupBy(data, 'times')
  const currentIndex = column - dynmicColumnIndex
  const item = data[currentIndex]
  if (_.isEmpty(item)) { return }
  let currentGroup = groups[item['times']]
  let currentGroupIndex = 0
  if (_.isEmpty(item)) { return }
  Object.keys(groups).map((key, index, arr) => {
    if (key === item['times']) {
      currentGroupIndex = index
    }
  })
  const startC = dynmicColumnIndex + currentGroupIndex * currentGroup.length
  let minList = []
  for (let i = startC; i < startC + currentGroup.length; i++) {
    minList.push(sheet.getValue(row, i))
  }
  console.log('minList', minList)
  let min = Math.min(...minList)
  if (value == min) {
    return true
  } else {
    return false
  }
}

//计算渲染结构
$.getJSON("data.json", function (data) {
  spread.suspendPaint();

  spread.fromJSON(data, { doNotRecalculateAfterLoad: true })

  var sheet = spread.getSheetFromName('designerBindingPathSchema');

  spread.options.referenceStyle = GC.Spread.Sheets.ReferenceStyle.r1c1;
  spread.getActiveSheet().recalcAll()

  const dynmicColumnIndex = getDynmicColumnIndex(data, 'designerBindingPathSchema', 'dynamic')

  $.getJSON("database.json", function (list) {
    const columnData = _.sortBy(list.data, function (o) { return o.times; })

    columnData.map((item, index) => {
      sheet.copyTo(-1, dynmicColumnIndex, -1, dynmicColumnIndex + index, -1, 1, GC.Spread.Sheets.CopyToOptions.all);
    })

    for (var row = 0; row < 30; row++) {
      for (var column = dynmicColumnIndex; column < sheet.getColumnCount(); column++) {
        const value = sheet.getValue(row, column);
        if (testBindValue(value)) {
          const text = getBindValue(columnData, value, column - dynmicColumnIndex)
          sheet.setValue(row, column, text)
        }
        if (value === '[minOfferPercent]') {
          const formula = calcFormula(columnData, column, dynmicColumnIndex)
          sheet.setFormula(row, column, formula, GC.Spread.Sheets.SheetArea.viewport)
        }
      }
    }

    for (var row = 0; row < 30; row++) {
      for (var column = dynmicColumnIndex; column < sheet.getColumnCount(); column++) {
        const value = sheet.getValue(row, column)
        const style = sheet.getStyle(row, column)
        sheet.setStyle(row, column, {
          ...style,
          "backColor": isMinInThisTimes(value, sheet, row, column, dynmicColumnIndex, columnData) ? "Accent 6" : null
        })
      }
    }

    var range = new GC.Spread.Sheets.Range(0, -1, 1, -1);
    sheet.autoMerge(range, GC.Spread.Sheets.AutoMerge.AutoMergeDirection.row)
    spread.resumePaint()
  })
})











// //直接材料成本
// const A = (item) => {
//   return item['materials'] + item['outsourcing']
// }

// //制造成本
// const D = (item) => {
//   return A(item) + item['labor'] + item['manufacturing']
// }

// //期间费用
// const E = (item) => {
//   return item['management'] + item['finance'] + item['sales']
// }

// //不含税出厂单价
// const G = (item) => {
//   return D(item) + E(item) + item['profit']
// }

// //含税出厂单价
// const I = (item) => {
//   return G(item) + item['vat']
// }

// //含税到厂单价
// const M = (item) => {
//   return I(item) + item['tools'] + item['package'] + item['transport']
// }

// //最低报价的差额与最低报价的百分比
// const N = (item, list) => {
//   const minOfferList = []
//   list.map((o) => {
//     minOfferList.push(M(o))
//   })
//   const minOffer = Math.min(...minOfferList)
//   return ((M(item) - minOffer) / minOffer * 100).toFixed(2) + '%'
// }



// /*
//  * 数字序号转字符串序号  0 => "A"
//  */
// function indexToString(index) {
//   var charcode;
//   return index.toString(26).split("").map(function (item, i) {
//     charcode = item.charCodeAt(0);
//     charcode += (charcode >= 97 ? 10 : 49);
//     return String.fromCharCode(charcode)
//   }).join("").toUpperCase();
// }

// /*
// * 字符串序号转数字序号  "A" => 0
// */
// function stringToIndex(str) {
//   var charcode;
//   return parseInt(str.toLowerCase().split("").map(function (item, i) {
//     charcode = item.charCodeAt(0);
//     charcode -= (charcode < 107 ? 49 : 10);
//     return String.fromCharCode(charcode)
//   }).join(""), 26);
// }

// //是否当次轮次最低
// const isMinInThisTimes = (field, item, list) => {
//   let minList = []
//   list.map(item => {
//     minList.push(parseInt(item[field]))
//   })
//   let min = Math.min(...minList)
//   if (parseInt(item[field]) == min) {
//     return true
//   } else {
//     return false
//   }
// }














