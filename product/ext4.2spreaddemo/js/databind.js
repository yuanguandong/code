var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
  sheetCount: 1
});

var datasource = [
  { name: 'Alice', age: 27, birthday: '1985/08/31', position: 'PM' }
];
// bindColumn one by one 
var nameColInfo = { name: 'name', displayName: 'Display Name', size: 70 };
var ageColInfo = { name: 'age', displayName: 'Age', size: 40, resizable: false };
var birthdayColInfo = { name: 'birthday', displayName: 'Birthday', formatter: 'd/M/yy', size: 120 };
var positionColInfo = { name: 'position', displayName: 'Position', size: 50, visible: false };
sheet.autoGenerateColumns = false;
sheet.setDataSource(datasource);
sheet.bindColumn(0, nameColInfo);
sheet.bindColumn(1, birthdayColInfo);
sheet.bindColumn(2, ageColInfo);
sheet.bindColumn(3, positionColInfo);

// or use bindColumns to bind all custom columns
var colInfos = [
  { name: 'position', displayName: 'Position', size: 50, visible: false },
  { name: 'name', displayName: 'Display Name', size: 70 },
  { name: 'birthday', displayName: 'Birthday', formatter: 'd/M/yy', size: 120 },
  { name: 'age', displayName: 'Age', size: 40, resizable: false },
];
sheet.autoGenerateColumns = false;
sheet.setDataSource(datasource);
sheet.bindColumns(colInfos);

