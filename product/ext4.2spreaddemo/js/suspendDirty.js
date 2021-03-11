
var startTime, endTime;

window.onload = function () {

  var spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"));
  var sheet = spread.getActiveSheet();
  var data = generateData(50000);
  var colInfos = generateBindingColumnInfos(7);
  loadingData(sheet, colInfos, data);

  spread.bind(GC.Spread.Sheets.Events.RangeSorting, function (sneder, args) {

    // Calling suspendDirty() method to stop the marking sorted cells dirty
    sheet.suspendDirty();
  });

  spread.bind(GC.Spread.Sheets.Events.RangeSorted, function (sender, args) {

    // Calling resumeDirty() method to restore dirty status of cells
    sheet.resumeDirty();
  });

};

function loadingData(sheet, colInfos, data) {
  sheet.suspendPaint();
  sheet.autoGenerateColumns = false;
  sheet.bindColumns(colInfos);
  sheet.setDataSource(data);
  sheet.rowFilter(new GC.Spread.Sheets.Filter.HideRowFilter(new GC.Spread.Sheets.Range(0, 0, sheet.getRowCount(), sheet.getColumnCount())));
  sheet.resumePaint();
}

function generateData(itemCount) {
  var data = [];
  var countries = ["China", "American", "UK", "Japan", "France"];
  var products = ["Computer", "Car", "Others"];
  var colors = ["Red", "Green", "Blue", "White", "Black", "Yellow", "Pink", "Orange"];
  var dt = new Date();

  for (var i = 0; i < itemCount; i++) {
    var item =
    {
      id: i,
      date: new Date(dt.getFullYear(), i % 12, 1),
      country: countries[Math.floor(Math.random() * countries.length)],
      product: products[Math.floor(Math.random() * products.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      amount: 1000 + Math.random() * 10000,
      big: Math.random() > .5
    };
    data.push(item);
  }
  return data;
}

function generateBindingColumnInfos(colCount) {
  var bindColumnInfos = [
    { name: "id", displayName: "ID", size: 60 },
    { name: "product", displayName: "Product", size: 90 },
    { name: "country", displayName: "Country", size: 90 },
    { name: "amount", displayName: "Amount", size: 90, formatter: "#,##0" },
    { name: "date", displayName: "Date", size: 90, formatter: 'yyyy-mm-dd' },
    { name: "color", displayName: "Color", size: 85 },
    { name: "big", displayName: "Big", size: 90, cellType: new GC.Spread.Sheets.CellTypes.CheckBox() }
  ];
  return bindColumnInfos;
}
