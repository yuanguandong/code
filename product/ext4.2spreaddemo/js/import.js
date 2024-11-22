var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
  sheetCount: 1
});
var activeSheet = spread.getActiveSheet();

//导入
const importExcel = (event) => {
  const file = event.target.files[0];
  const excelIO = new GC.Spread.Excel.IO();
  excelIO.open(file, (spreadJSON) => {
    if (spread) {
      spread.fromJSON(spreadJSON);
    }
  });
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


$("#import").on('change', function (e) {
  importExcel(e)
})

$("#export").on('click', function (e) {
  exportExcel()
})

$("#print").on('click', function (e) {
  if (spread) {
    activeSheet.print()
  }
  // exportExcel()
})


const hAlignLeft = () => {
  if (this.spread) {
    let range = sheet.getSelections();

  }
}
// 打印
// 居左居右
//事件捕获
