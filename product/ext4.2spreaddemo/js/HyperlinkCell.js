var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
  sheetCount: 1
});
var activeSheet = spread.getActiveSheet();

var cellType = new GC.Spread.Sheets.CellTypes.HyperLink();
cellType.linkColor("blue");
cellType.visitedLinkColor("#FF2235");
cellType.text("GrapeCity");
cellType.linkToolTip("Company Web Site");
activeSheet.getCell(1, 1).cellType(cellType).value("http://spread.grapecity.com/");
activeSheet.getRange(1, -1, 1, -1).height(30)
// .textIndent(3).wordWrap(true)



var h = new GC.Spread.Sheets.CellTypes.HyperLink();
activeSheet.setCellType(3, 2, h, GC.Spread.Sheets.SheetArea.viewport);

h.text('Spread.Sheets Site');

h.linkColor('blue');

// Set a callback action to the hyperlink

h.onClickAction(function () {
  var setSheetTabColor = {
    canUndo: true,
    execute: function (context, options, isUndo) {
      activeSheet.name('Hyperlink');
      activeSheet.options.sheetTabColor = 'red';
    }
  };
  var commandManager = spread.commandManager();
  var commandName = 'setSheetTabStyle';
  commandManager.register(commandName, setSheetTabColor, null, false, false, false, false);
  commandManager.execute({ cmd: commandName });
});
