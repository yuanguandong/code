var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
  sheetCount: 1
});
var activeSheet = spread.getActiveSheet();

activeSheet.setValue(0, 1, "testing111111111111111");
activeSheet.autoFitColumn(1);

activeSheet.setValue(0, 1, "testing\r\nmultiple\r\nlines");
activeSheet.getCell(0, 1).wordWrap(true);
activeSheet.autoFitRow(0);