

$(document).ready(function () {
  // Initializing Spread
  var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });

  // Drag Fill strings
  var sheet1 = spread.getSheet(0);
  sheet1.name("String DragFill");

  //N: number, S: string.
  /* DragFill for string, detecting number from end to start, SN first and NS second.Trend N if S is same */
  sheet1.setValue(0, 0, 'Please drag up or down');
  sheet1.setValue(1, 0, 'String contains numbers only');
  sheet1.setValue(6, 0, '123');
  sheet1.setValue(7, 0, '125');
  sheet1.setValue(6, 1, '-3');
  sheet1.setValue(7, 1, '-2');
  sheet1.setValue(6, 2, '003');
  sheet1.setValue(7, 2, '007');
  sheet1.setColumnWidth(2, 70);
  sheet1.setColumnWidth(3, 20);

  sheet1.setValue(1, 4, 'String contains number in the end');

  // Choose "Fill Series" for the single one
  sheet1.setValue(6, 4, 'a2');
  sheet1.setValue(6, 5, 'a1');
  sheet1.setValue(7, 5, 'a5');
  sheet1.setValue(6, 6, 'a001');
  sheet1.setValue(7, 6, 'a002');
  sheet1.setValue(6, 7, '1a2a3a4a5');
  sheet1.setValue(7, 7, '1a2a3a4a6');
  sheet1.setColumnWidth(7, 80);

  sheet1.setValue(13, 0, 'String contains numbers initally');
  sheet1.setValue(18, 0, '5a');
  sheet1.setValue(19, 0, '2a');
  sheet1.setValue(18, 1, '003b');
  sheet1.setValue(19, 1, '005b');
  sheet1.setValue(18, 2, '1a1a1a');
  sheet1.setValue(19, 2, '2a1a1a');

  sheet1.setValue(13, 4, 'String just to copy');
  sheet1.setValue(18, 4, 'a1a1');
  sheet1.setValue(19, 4, 'a2a2');
  sheet1.setValue(18, 5, '1a1');
  sheet1.setValue(19, 5, '2a2');
  sheet1.setValue(18, 6, 'a1');
  sheet1.setValue(19, 6, 'b2');
});
