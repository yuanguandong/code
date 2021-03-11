
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });
// Drag Fill strings
var activeSheet = spread.getSheet(0);


//button
var cellType = new GC.Spread.Sheets.CellTypes.Button();
cellType.buttonBackColor("#FFFF00");
cellType.text("this is a button");
activeSheet.getCell(0, 2).cellType(cellType);


//checkbox
var cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
cellType.caption("caption");
cellType.textTrue("True");
cellType.textFalse("False");
cellType.textIndeterminate("Indeterminate");
// cellType.wordWrap(false);
cellType.textAlign(GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.bottom);
cellType.isThreeState(true);
activeSheet.getCell(1, 2).cellType(cellType);
// activeSheet.getCell(1, 1).value(1);



//radio
// This example creates a radioButtonList celltype
var radioButtonListCellType = new GC.Spread.Sheets.CellTypes.RadioButtonList();
// activeSheet.setText(0, 1, "Select Mode Of Payment : ", GC.Spread.Sheets.SheetArea.viewport);
radioButtonListCellType.items([
  { text: "Credit Card", value: 1 },
  { text: "Debit Card", value: 2 },
  { text: "Cash", value: 3 }
]);
// radioButtonListCellType.isFlowLayout(true);
// Configure the direction of the radio button list to horizontal
radioButtonListCellType.direction(GC.Spread.Sheets.CellTypes.Direction.horizontal);
// Configure the space for two items in the radio button list
radioButtonListCellType.itemSpacing({
  horizontal: 20, vertical: 10
});
// Configure the text of radio button's position, only support left and right
radioButtonListCellType.textAlign(GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.left);
activeSheet.getCell(2, 2).cellType(radioButtonListCellType);
// Configure the column width



//ButtonList
// This example creates a ButtonList celltype
var buttonListCellType = new GC.Spread.Sheets.CellTypes.ButtonList();
// activeSheet.setText(2, 3, "Select Programming Languages : ", GC.Spread.Sheets.SheetArea.viewport);
buttonListCellType.items([
  { text: "Javascript", value: 1 },
  { text: "Python", value: 2 },
  { text: "Java", value: 3 },
  { text: "PHP", value: 4 },
  { text: "Objective-C", value: 5 },
  { text: "Ruby", value: 6 },
  { text: "SQL", value: 7 },
  { text: "Swift", value: 8 },
  { text: "C/CPP", value: 9 },
  { text: "C#", value: 10 }
]);
activeSheet.getCell(3, 2).cellType(buttonListCellType);
// Set the buttonListCellType Direction to vertical
buttonListCellType.direction(GC.Spread.Sheets.CellTypes.Direction.vertical);
// Set the space for two items in the buttonList
buttonListCellType.itemSpacing({
  horizontal: 80,
  vertical: 20
});
// Set the row height
activeSheet.setRowHeight(3, 250.0, GC.Spread.Sheets.SheetArea.viewport);
// Set the column width
activeSheet.setColumnWidth(2, 250.0, GC.Spread.Sheets.SheetArea.viewport);





//自适应列宽
activeSheet.autoFitColumn(2)
// activeSheet.setColumnWidth(1, 300.0, GC.Spread.Sheets.SheetArea.viewport);