
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
  sheetCount: 1
});
var activeSheet = spread.getActiveSheet();


activeSheet.setRowCount(4,1);
activeSheet.setColumnCount(4,2);
activeSheet.addSpan(0,0,3,3,GC.Spread.Sheets.SheetArea.colHeader);
activeSheet.addSpan(0,0,3,3,GC.Spread.Sheets.SheetArea.rowHeader);
activeSheet.addSpan(0,0,3,3,GC.Spread.Sheets.SheetArea.viewport);

// activeSheet.setRowCount(2,GC.Spread.Sheets.SheetArea.colHeader);
// activeSheet.setColumnCount(2,GC.Spread.Sheets.SheetArea.rowHeader);
// activeSheet.setValue(0, 2,"Column",GC.Spread.Sheets.SheetArea.colHeader);
// activeSheet.options.rowHeaderAutoTextIndex = 1;
// activeSheet.options.rowHeaderAutoText = GC.Spread.Sheets.HeaderAutoText.numbers;
// activeSheet.options.colHeaderAutoTextIndex = 1;
// activeSheet.options.colHeaderAutoText = GC.Spread.Sheets.HeaderAutoText.letters;