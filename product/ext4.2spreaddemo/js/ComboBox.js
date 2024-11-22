
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });
// Drag Fill strings
var activeSheet = spread.getSheet(0);


var cellType2 = new GC.Spread.Sheets.CellTypes.ComboBox();
cellType2.items(["a", "b", "c"]);
activeSheet.getCell(2, 2).cellType(cellType2);


var items2 = ["a", "ab", "abc", "apple", "boy", "cat", "dog"];
var eComboBoxCellType = new GC.Spread.Sheets.CellTypes.ComboBox().items(items2).editable(true);
activeSheet.getCell(1, 3).cellType(eComboBoxCellType);
activeSheet.setColumnWidth(3, 120);