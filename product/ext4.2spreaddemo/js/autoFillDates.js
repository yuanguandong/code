
// Initializing Spread
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });

// Drag Fill Dates
var sheet1 = spread.getSheet(0);
sheet1.name("Date DragFill");
sheet1.setValue(0, 0, 'Please drag up or down');
sheet1.setValue(1, 0, 'First day of month to dragfill');

sheet1.setColumnWidth(0, 80);
sheet1.setValue(6, 0, new Date(2018, 3, 1));
sheet1.setValue(7, 0, new Date(2018, 4, 1));
sheet1.getRange(6, 0, 2, 1).formatter('m/d/yyyy');
sheet1.setColumnWidth(1, 80);
sheet1.setValue(6, 1, new Date(2017, 11, 1));
sheet1.setValue(7, 1, new Date(2018, 0, 1));
sheet1.getRange(6, 1, 2, 1).formatter('m/d/yyyy');

sheet1.setValue(1, 3, 'Last day of month to dragfill');
sheet1.setColumnWidth(3, 80);
sheet1.setValue(6, 3, new Date(2018, 2, 31));
sheet1.setValue(7, 3, new Date(2018, 3, 30));
sheet1.getRange(6, 3, 2, 1).formatter('m/d/yyyy');
sheet1.setColumnWidth(4, 80);
sheet1.setValue(6, 4, new Date(2017, 11, 31));
sheet1.setValue(7, 4, new Date(2018, 0, 31));
sheet1.getRange(6, 4, 2, 1).formatter('m/d/yyyy');
