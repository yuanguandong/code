
// Initializing Spread
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });

// Get the activesheet
var activeSheet = spread.getActiveSheet();

// Adding Data to the spreadsheet
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
