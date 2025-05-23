var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
  sheetCount: 1
});
var activeSheet = spread.getActiveSheet();

spread.options.allowUserDragFill = true;

activeSheet.setValue(0, 0, new Date(2011, 1, 1));
activeSheet.setValue(0, 1, new Date(2011, 2, 9));
activeSheet.setValue(0, 2, 5);
activeSheet.setValue(0, 3, 10);
activeSheet.setValue(0, 4, 1);

var start = new GC.Spread.Sheets.Range(0, 0, 1, 1);
var r = new GC.Spread.Sheets.Range(0, 0, 4, 1);
activeSheet.fillAuto(start, r, {
  fillType: GC.Spread.Sheets.Fill.FillType.date,
  series: GC.Spread.Sheets.Fill.FillSeries.column,
  fillDirection: GC.Spread.Sheets.Fill.FillDirection.down,
  unit: GC.Spread.Sheets.Fill.FillDateUnit.day,
  step: 1,
  stop: new Date(2011, 2, 11)
});

// start = new GC.Spread.Sheets.Range(0, 1, 1, 1);
// var r2 = new GC.Spread.Sheets.Range(0, 1, 4, 1);
// activeSheet.fillAuto(start, r2, {
//   fillType: GC.Spread.Sheets.Fill.FillType.date,
//   series: GC.Spread.Sheets.Fill.FillSeries.column,
//   fillDirection: GC.Spread.Sheets.Fill.FillDirection.down,
//   unit: GC.Spread.Sheets.Fill.FillDateUnit.day,
//   step: 1,
//   stop: new Date(2011, 2, 11)
// });

// start = new GC.Spread.Sheets.Range(0, 2, 1, 1);
// var r3 = new GC.Spread.Sheets.Range(0, 2, 4, 1);
// activeSheet.fillAuto(start, r3, {
//   fillType: GC.Spread.Sheets.Fill.FillType.auto,
//   series: GC.Spread.Sheets.Fill.FillSeries.column,
// });

// start = new GC.Spread.Sheets.Range(0, 3, 1, 1);
// var r4 = new GC.Spread.Sheets.Range(0, 3, 4, 1);
// activeSheet.fillAuto(start, r4, {
//   fillType: GC.Spread.Sheets.Fill.FillType.growth,
//   series: GC.Spread.Sheets.Fill.FillSeries.column,
//   step: 2,
//   stop: 55
// });

// start = new GC.Spread.Sheets.Range(0, 4, 1, 1);
// var r5 = new GC.Spread.Sheets.Range(0, 4, 4, 1);
// activeSheet.fillAuto(start, r5, {
//   fillType: GC.Spread.Sheets.Fill.FillType.linear,
//   series: GC.Spread.Sheets.Fill.FillSeries.column,
//   step: 3,
//   stop: 20
// });

// activeSheet.setValue(0, 5, 123);
// var r6 = new GC.Spread.Sheets.Range(0, 5, 4, 1);
// activeSheet.fillAuto(new GC.Spread.Sheets.Range(0, 5, 1, 1), r6, {
//   fillType: GC.Spread.Sheets.Fill.FillType.auto,
//   series: GC.Spread.Sheets.Fill.FillSeries.column,
// });
