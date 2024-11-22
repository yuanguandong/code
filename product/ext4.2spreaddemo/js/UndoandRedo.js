
var command = {
  canUndo: true, execute: function (context, options, isUndo) {
    var Commands = GC.Spread.Sheets.Commands;
    if (isUndo) {
      Commands.undoTransaction(context, options);
      return true;
    }

    else {
      Commands.startTransaction(context, options);
      var sheet = context.getSheetFromName(options.sheetName);
      var cell = sheet.getCell(options.row, options.col);
      cell.backColor(options.backColor);
      Commands.endTransaction(context, options);
      return true;
    }

  }
};
var spread = GC.Spread.Sheets.findControl(document.getElementById("sampleDiv"));
var commandManager = spread.commandManager();
commandManager.register("changeBackColor", command);
commandManager.execute({ cmd: "changeBackColor", sheetName: spread.getSheet(0).name(), row: 1, col: 2, backColor: "red" });


// spread.options.allowUndo = true;
// spread.commandManager().execute({ cmd: "outlineRow", sheetName: activeSheet.name(), index: 3, count: 5 });

// spread.options.allowUserZoom = false;
// activeSheet.zoom(30);