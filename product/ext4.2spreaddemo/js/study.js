

//导入
const importExcel = (event) => {
  const file = event.target.files[0];
  if (file.name.split('.')[1] == 'xlsx') {
    const excelIO = new GC.Spread.Excel.IO();
    excelIO.open(file, (spreadJSON) => {
      if (spread) {
        spread.fromJSON(spreadJSON)
      }
    })
  } else if (file.name.split('.')[1] == 'ssjson') {
    var reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (e) {
      if (e.target && e.target.result && spread) {
        var jsonOjb = JSON.parse(e.target.result)
        spread.fromJSON(jsonOjb, { doNotRecalculateAfterLoad: true })
      }
    }
  }
}

// 下载ssjson文件方法
const funDownload = (content, filename) => {
  var eleLink = document.createElement("a");
  eleLink.download = filename;
  eleLink.style.display = "none";
  // 字符内容转变成blob地址
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}

// 导出
const exportExcel = () => {
  if (spread) {
    let spreadJSON = JSON.stringify(spread.toJSON());
    const excelIO = new GC.Spread.Excel.IO();
    excelIO.save(spreadJSON, function (blob) {
      saveAs(blob, "export.xlsx");
    }, function (e) {
      console.log(e);
    });
  }
}

// 导出json
const exportJSON = () => {
  if (spread) {
    let spreadJSON = JSON.stringify(spread.toJSON());
    funDownload(spreadJSON,'export.ssjson')
  }
}

//打印
const print = () => {
  spread.print();
}

//生成公式条
spread.options.allowUserEditFormula = true;
rangeSelector = new GC.Spread.Sheets.FormulaTextBox.FormulaTextBox(document.getElementById("ftb"), { rangeSelectMode: true });
rangeSelector.workbook(spread);


//居左
const hAlignLeft = () => {
  if (spread) {
    let sheet = spread.getActiveSheet();
    let range = sheet.getSelections()[0];
    sheet.suspendPaint();
    sheet.getSelections().forEach(function (sel) {
      sheet
        .getRange(sel.row, sel.col, sel.rowCount, sel.colCount)
        .hAlign(GC.Spread.Sheets.HorizontalAlign.left).foreColor('red');
    });
    sheet.resumePaint();
  }
}

//居右
const hAlignRight = () => {
  if (this.spread) {
    let sheet = this.spread.getActiveSheet();
    sheet.suspendPaint();
    sheet.getSelections().forEach(function (sel) {
      sheet
        .getRange(sel.row, sel.col, sel.rowCount, sel.colCount)
        .hAlign(GC.Spread.Sheets.HorizontalAlign.right).foreColor('blue');
    });
    sheet.resumePaint();
  }
}

//消息提示
const sendMessage = (info) => {
  let cellRef = GC.Spread.Sheets.CalcEngine.rangeToFormula(
    new GC.Spread.Sheets.Range(
      info.row,
      info.col,
      info.rowCount | 1,
      info.colCount | 1
    ),
    0,
    0,
    GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allRelative,
    false
  );
  let message = "单元格" + cellRef + "发生了变化！";
  $('#info').html(message)
}

//注册事件
const registEvent = (spread) => {
  spread.bind(GC.Spread.Sheets.Events.ValueChanged, (s, e) => {
    sendMessage(e);
  });
  spread.bind(GC.Spread.Sheets.Events.RangeChanged, (s, e) => {
    sendMessage(e);
  });
}


$("#import").on('change', function (e) {
  importExcel(e)
})

$("#export").on('click', function (e) {
  exportExcel()
})

$("#print").on('click', function (e) {
  print()
})

$("#alignLeft").on('click', function (e) {
  hAlignLeft()
})

$("#alignRight").on('click', function (e) {
  hAlignRight()
})

$("#exportJSON").on('click', function (e) {
  exportJSON()
})


//添加状态栏
var spanItem = new GC.Spread.Sheets.StatusBar.StatusItem('spanItem', { menuContent: 'Current span', value: 'Span test' });
var statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
  document.getElementById('statusBar'),
  { items: [spanItem] }
);
statusBar.bind(spread);
// registEvent(spread);
registEvent(spread)





//单元格背景
activeSheet.setValue(0, 1, "Y-2015");
activeSheet.setValue(0, 2, "Y-2016");
activeSheet.setValue(0, 3, "Y-2017");
activeSheet.setValue(0, 4, "Y-2018");
activeSheet.setValue(0, 5, "Y-2019");
activeSheet.setValue(1, 0, "Gradlco");
activeSheet.setValue(2, 0, "Saagiate");
activeSheet.setValue(3, 0, "Inferno");
activeSheet.setColumnWidth(0, 120);

for (var r = 1; r <= 3; r++) {
  for (var c = 1; c <= 5; c++) {
    activeSheet.setValue(r, c, parseInt(Math.random() * 5000));
  }
}

// Creating a hoverStyle
var hoverStyle = new GC.Spread.Sheets.Style();
hoverStyle.backColor = "pink";
hoverStyle.foreColor = "red";

// Creating a selectStyle
var selectStyle = new GC.Spread.Sheets.Style();
selectStyle.backColor = "yellow";
selectStyle.foreColor = "red";


// Creating a range
var range = new GC.Spread.Sheets.Range(0, 0, 4, 6);

// Applying hoverStyle & selectStyle on same range
activeSheet.cellStates.add(range, GC.Spread.Sheets.CellStatesType.hover, hoverStyle);
activeSheet.cellStates.add(range, GC.Spread.Sheets.CellStatesType.active, selectStyle);





