// window.onload = function () {
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
  sheetCount: 1
});

var sheet = spread.getSheet(0);
var person = {
  name: 'Wang feng',
  age: 25,
  gender: 'Male',
  address: {
    postcode: '710075'
  }
};
var source = new GC.Spread.Sheets.Bindings.CellBindingSource(person);
sheet.setBindingPath(2, 2, 'name');
sheet.setBindingPath(3, 2, 'age');
sheet.setBindingPath(4, 2, 'gender');
sheet.setBindingPath(5, 2, 'address.postcode');
sheet.setDataSource(source);

sheet.getCell(2, 1).text("Name");
sheet.getCell(3, 1).text("Age");
sheet.getCell(4, 1).text("Gender");
sheet.getCell(5, 1).text("Address.Postcode");
sheet.addSpan(1, 1, 1, 2);
sheet.getRange(1, 1, 1, 2).text("Person Card")
sheet.setColumnWidth(1, 120);
sheet.setColumnWidth(2, 120);
sheet.getRange(1, 1, 1, 2).backColor("rgb(20, 140, 1218)")
sheet.getRange(2, 1, 4, 1).backColor("rgb(169, 238, 243)")
sheet.getRange(2, 2, 4, 1).backColor("rgb(247, 197, 113)")
sheet.getRange(1, 1, 5, 2).setBorder(new GC.Spread.Sheets.LineBorder("Black", GC.Spread.Sheets.LineStyle.thin), {
  all: true
});
sheet.getRange(2, 1, 4, 2).setBorder(new GC.Spread.Sheets.LineBorder("Black", GC.Spread.Sheets.LineStyle.dotted), {
  inside: true
});
sheet.getRange(1, 1, 1, 2).hAlign(GC.Spread.Sheets.HorizontalAlign.center);

const data = sheet.getDataSource()
