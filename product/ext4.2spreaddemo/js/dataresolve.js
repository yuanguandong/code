
//直接材料成本
const A = (item) => {
  return item['materials'] + item['outsourcing']
}

//制造成本
const D = (item) => {
  return A(item) + item['labor'] + item['manufacturing']
}

//期间费用
const E = (item) => {
  return item['management'] + item['finance'] + item['sales']
}

//不含税出厂单价
const G = (item) => {
  return D(item) + E(item) + item['profit']
}

//含税出厂单价
const I = (item) => {
  return G(item) + item['vat']
}

//含税到厂单价
const M = (item) => {
  return I(item) + item['tools'] + item['package'] + item['transport']
}

//最低报价的差额与最低报价的百分比
const N = (item, list) => {
  const minOfferList = []
  list.map((o) => {
    minOfferList.push(M(o))
  })
  const minOffer = Math.min(...minOfferList)
  return ((M(item) - minOffer) / minOffer * 100).toFixed(2) + '%'
}

//是否当次轮次最低
const isMinInThisTimes = (field, item, list) => {
  let minList = []
  list.map(item => {
    minList.push(parseInt(item[field]))
  })
  let min = Math.min(...minList)
  if (parseInt(item[field]) == min) {
    return true
  } else {
    return false
  }
}

$.getJSON("data.json", function (data) {
  spread.suspendPaint();
  console.log('data', data)

  //动态列索引计算
  let dynamicColumnsIndex = []
  const columnDataArray = data.sheets.Sheet1.data.columnDataArray
  const dataTable = data.sheets.Sheet1.data.dataTable
  console.log('columnDataArray', columnDataArray)
  console.log('dataTable', dataTable)

  columnDataArray.forEach((item, index) => {
    if (!_.isEmpty(item) && item.tag === 'dynamic') {
      dynamicColumnsIndex.push(index)
    }
  })

  //动态列模板计算
  // let dynamicColumnsTemplate = []
  // Object.keys(dataTable).map(key => {
  //   dynamicColumnsTemplate.push(
  //     dataTable[key][dynamicColumnsIndex[0]]
  //   )
  // })
  // console.log('dynamicColumnsTemplate', dynamicColumnsTemplate)


  //根据数据改变表单结构
  $.getJSON("database.json", function (list) {
    const columnData = _.sortBy(list.data, function (o) { return o.times; })
    let group = _.groupBy(columnData, 'times')
    columnData.map((item, index) => {
      columnData[index] = {
        ...item,
        A: A(item),
        D: D(item),
        E: E(item),
        G: G(item),
        I: I(item),
        M: M(item),
        N: N(item, group[item['times']])
      }
    })
    group = _.groupBy(columnData, 'times')
    columnData.map((item, index) => {
      Object.keys(dataTable).map(key => {
        const templateCell = dataTable[key][dynamicColumnsIndex[0]]
        if (templateCell && templateCell.bindingPath) {
          const field = templateCell.bindingPath.split('.')[1]
          delete templateCell['formula']
          const templateCellStyle = templateCell.style
          dataTable[key][dynamicColumnsIndex[0] + index] = {
            ...templateCell,
            style: {
              ...templateCellStyle,
              "backColor": isMinInThisTimes(field, item, group[item['times']]) ? "Accent 6" : null
            },
            value: item[field]
          }
        } else {
          dataTable[key][dynamicColumnsIndex[0] + index] = {
            ...templateCell,
          }
        }
      })
    })
    data.sheets.Sheet1.columns.splice(dynamicColumnsIndex[0], 1, {
      size: 100
    })
    data.sheets.Sheet1.data.dataTable = dataTable
    data.sheets.Sheet1.autoMergeRangeInfos = [{
      "range": {
        "row": 0,
        "col": -1,
        "rowCount": 1,
        "colCount": -1
      },
      "direction": 2,
      "mode": 0,
      "sheetArea": 3
    }]

    spread.fromJSON(data, { doNotRecalculateAfterLoad: true })
    // spread.options.referenceStyle = GC.Spread.Sheets.ReferenceStyle.r1c1;
    // spread.getActiveSheet().recalcAll()
    const sheet = spread.getActiveSheet()
    
    spread.resumePaint()

    //开启保护工作表
    var option = {
      allowSelectLockedCells: false,
      allowSelectUnlockedCells: true,
      allowFilter: true,
      allowSort: false,
      allowResizeRows: true,
      allowResizeColumns: false,
      allowEditObjects: false,
      allowDragInsertRows: false,
      allowDragInsertColumns: false,
      allowInsertRows: false,
      allowInsertColumns: false,
      allowDeleteRows: false,
      allowDeleteColumns: false
    };
    sheet.options.protectionOptions = option;
    sheet.options.isProtected = true;
  })
})

























