
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });
var sheet = spread.getSheet(0);

// Setting array of values
var dataArray = [
  ["", 'Chrome', 'Firefox', 'IE', 'Safari', 'Edge', 'Opera', 'Other'],
  ["2017", 0.6360, 0.1304, 0.0834, 0.0589, 0.0443, 0.0223, 0.0246],
  ["2018", 0.3260, 0.2638, 0.1828, 0.0367, 0.9721, 0.2732, 0.3762],

];
sheet.setArray(0, 0, dataArray, false);

// Setting array of formulas
var formulaArray = [
  ["=1+1", "=2+2", "=3+3"],
  ["=4+4", "=5+5", "=6+6"],
  ["=7+7", "=8+8", "=9+9"]
];
sheet.setArray(5, 2, formulaArray, true);
