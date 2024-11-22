var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
  sheetCount: 1
});
var activeSheet = spread.getActiveSheet();

var openDialog = {
  text: 'Open Dialog',
  name: 'openDialog',
  command: showLoginDialog,
  workArea: 'viewport'
};
spread.contextMenu.menuData.push(openDialog);
function showLoginDialog() {
  //to do something
}

// Add/Remove the custom menu options

$.each(spread.contextMenu.menuData, function (p, v) {
  if (v.name === 'openDialog') { //openDialog is a command's name
    spread.contextMenu.menuData.splice(p, 1)
  }
});
