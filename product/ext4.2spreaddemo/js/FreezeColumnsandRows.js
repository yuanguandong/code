activeSheet.frozenRowCount(1);
activeSheet.frozenColumnCount(1);
//activeSheet.options.frozenlineColor = "red";


// var hitArea = workbook.hitTest(6,7)


activeSheet.getCell(0, 0).imeMode(GC.Spread.Sheets.ImeMode.Disabled);
//or
var style = new GC.Spread.Sheets.Style();
style.imeMode = GC.Spread.Sheets.ImeMode.Disabled;
activeSheet.setStyle(0, 0, style);