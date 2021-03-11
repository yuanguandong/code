
initSpread(spread);

function initSpread(spread) {
  spread.suspendPaint();
  var style = new GC.Spread.Sheets.Style();
  style.locked = false;
  style.backColor = 'lightGreen';
  var salesData = [
    ['SalesPers', 'Region'],
    ['Joe', 'North'],
    ['Robert', 'South'],
    ['Michelle', 'East'],
    ['Erich', 'West'],
    ['Dafna', 'North'],
    ['Rob', 'South'],
    ['SalesPers', 'Region'],
    ['Joe', 'North'],
    ['Robert', 'South'],
    ['Michelle', 'East'],
    ['Erich', 'West'],
    ['Dafna', 'North'],
    ['Rob', 'South'],
    ['SalesPers', 'Region'],
    ['Joe', 'North'],
    ['Robert', 'South'],
    ['Michelle', 'East'],
    ['Erich', 'West'],
    ['Dafna', 'North'],
    ['Rob', 'South']
  ];

  sheet.setArray(0, 0, salesData);
  sheet.setStyle(1, 1, style);
  sheet.setStyle(1, 2, style);
  sheet.setStyle(5, 1, style);
  sheet.setStyle(5, 2, style);
  sheet.setStyle(8, -1, style);
  sheet.setStyle(9, -1, style);
  sheet.setStyle(12, -1, style);
  sheet.setStyle(13, -1, style);
  sheet.setStyle(-1, 8, style);
  sheet.setStyle(-1, 9, style);
  sheet.setStyle(-1, 12, style);
  sheet.setStyle(-1, 13, style);
  var style2 = new GC.Spread.Sheets.Style();
  style2.locked = true;
  style2.backColor = 'gray';
  sheet.setStyle(13, 1, style2);
  sheet.setStyle(1, 13, style2);

  sheet.tables.add('table1', 2, 3, 4, 4);

  var filter = new GC.Spread.Sheets.Filter.HideRowFilter(new GC.Spread.Sheets.Range(0, 0, 100, 2));
  sheet.rowFilter(filter);

  sheet.comments.add(17, 0, 'locked');
  sheet.comments.add(17, 4, 'unlocked');
  sheet.comments.get(17, 0).locked(true).displayMode(1);
  sheet.comments.get(17, 4).locked(false).displayMode(1).lockText(false);

  spread.resumePaint();

  var option = {
    allowSelectLockedCells: false,
    allowSelectUnlockedCells: true,
    allowFilter: true,
    allowSort: false,
    allowResizeRows: true,
    allowResizeColumns: false,
    allowEditObjects: false,
    allowDragInsertRows: false,
    allowDragInsertColumns: false,
    allowInsertRows: false,
    allowInsertColumns: false,
    allowDeleteRows: false,
    allowDeleteColumns: false
  };
  sheet.options.protectionOptions = option;
  sheet.options.isProtected = true;

  // option = sheet.options.protectionOptions;
  // _getElementById('chkProtectSheet').checked = sheet.options.isProtected;
  // _getElementById('chkSelectLockedCells').checked = option.allowSelectLockedCells;
  // _getElementById('chkSelectUnlockedCells').checked = option.allowSelectUnlockedCells;
  // _getElementById('chkAllowSort').checked = option.allowSort;
  // _getElementById('chkAllowFilter').checked = option.allowFilter;
  // _getElementById('chkAllowResizeRows').checked = option.allowResizeRows;
  // _getElementById('chkAllowResizeColumns').checked = option.allowResizeColumns;
  // _getElementById('chkAllowEditObjects').checked = option.allowEditObjects;
  // _getElementById('chkAllowDragInsertRows').checked = option.allowDragInsertRows;
  // _getElementById('chkAllowDragInsertColumns').checked = option.allowDragInsertColumns;
  // _getElementById('chkAllowInsertRows').checked = option.allowInsertRows;
  // _getElementById('chkAllowInsertColumns').checked = option.allowInsertColumns;
  // _getElementById('chkAllowDeleteRows').checked = option.allowDeleteRows;
  // _getElementById('chkAllowDeleteColumns').checked = option.allowDeleteColumns;

  // _getElementById('chkProtectSheet').addEventListener('click', function () {
  //   var sheet = spread.getActiveSheet();
  //   var value = this.checked;
  //   sheet.options.isProtected = value;
  // });

  // _getElementById('setProtectionOptions').addEventListener('click', function () {
  //   var option = {
  //     allowSelectLockedCells: _getElementById('chkSelectLockedCells').checked,
  //     allowSelectUnlockedCells: _getElementById('chkSelectUnlockedCells').checked,
  //     allowSort: _getElementById('chkAllowSort').checked,
  //     allowFilter: _getElementById('chkAllowFilter').checked,
  //     allowResizeRows: _getElementById('chkAllowResizeRows').checked,
  //     allowResizeColumns: _getElementById('chkAllowResizeColumns').checked,
  //     allowEditObjects: _getElementById('chkAllowEditObjects').checked,
  //     allowDragInsertRows: _getElementById('chkAllowDragInsertRows').checked,
  //     allowDragInsertColumns: _getElementById('chkAllowDragInsertColumns').checked,
  //     allowInsertRows: _getElementById('chkAllowInsertRows').checked,
  //     allowInsertColumns: _getElementById('chkAllowInsertColumns').checked,
  //     allowDeleteRows: _getElementById('chkAllowDeleteRows').checked,
  //     allowDeleteColumns: _getElementById('chkAllowDeleteColumns').checked
  //   };
  //   var sheet = spread.getActiveSheet();
  //   sheet.options.protectionOptions = option;
  // });
}

// function _getElementById(id) {
//   return document.getElementById(id);
// }
