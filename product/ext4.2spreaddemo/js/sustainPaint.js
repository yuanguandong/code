
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });
var sheet = spread.getSheet(0);

spread.suspendPaint();
spread.suspendEvent();
sheet.setRowCount(10000);
sheet.setColumnCount(100);

for (var i = 0; i < 10000; i++) {
  for (var j = 0; j < 100; j++) {
    sheet.setValue(i, j, new Date(), GC.Spread.Sheets.SheetArea.viewport);
    sheet.getCell(i, j).formatter("yyyy/mm/dd");
    sheet.setColumnWidth(j, 80.0, GC.Spread.Sheets.SheetArea.viewport);
  }
}

spread.resumeEvent();
spread.resumePaint();
