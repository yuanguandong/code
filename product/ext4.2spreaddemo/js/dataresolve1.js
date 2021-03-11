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
  let dynamicColumnsTemplate = []
  Object.keys(dataTable).map(key => {
    dynamicColumnsTemplate.push(
      dataTable[key][dynamicColumnsIndex[0]]
    )
  })
  console.log('dynamicColumnsTemplate', dynamicColumnsTemplate)


  //根据数据改变表单结构
  $.getJSON("database.json", function (list) {
    const columnData = _.sortBy(list.data, function (o) { return o.times; })
    columnData.map((item, index) => {
      Object.keys(dataTable).map(key => {
        const templateCell = dataTable[key][dynamicColumnsIndex[0]]

        if (templateCell && templateCell.bindingPath) {
          const field = templateCell.bindingPath.split('.')[1]
          dataTable[key][dynamicColumnsIndex[0] + index] = {
            ...templateCell,
            value: item[field]
          }
        } else {
          dataTable[key][dynamicColumnsIndex[0] + index] = {
            ...templateCell,
          }
        }
      })
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
    spread.resumePaint();
  })
})

























