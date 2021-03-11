
var spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"));
var sheet = spread.getActiveSheet();
spread.bind(GC.Spread.Sheets.Events.CellChanged, function (sender, args) {
  console.log('sender',sender)
  console.log('CellChanged event fired for Cell[' + args.row + "," + args.col + "] having value " + sheet.getValue(args.row, args.col));
});

spread.suspendPaint();
spread.suspendEvent();
for (var i = 0; i < 20; i++) {
  for (var j = 0; j < 10; j++) {
    sheet.setValue(i, j, "111");
  }
}
spread.resumeEvent();
spread.resumePaint();

/* The CellChanged event in this case will be fired for only Cell[22,2]
and not for other cells because value of Cell[22, 2] is set after the bounds of suspendEvent() & resumeEvent() methods */

sheet.setValue(22, 2, "222");
