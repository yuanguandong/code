activeSheet.setValue(0, 0, 1);
activeSheet.setValue(0, 1, 2);
activeSheet.setValue(0, 2, 10);
activeSheet.getCell(1, 1).formula("=SUM(A1:C1)");


// Allow Users to Enter Formulas
spread.options.allowUserEditFormula = true;


// Create Custom Names
activeSheet.setValue(0, 0, 1);
activeSheet.setValue(0, 1, 2);
activeSheet.setValue(0, 2, 3);
activeSheet.addCustomName("customName1", "=12", 0, 0);
activeSheet.addCustomName("customName2", "Average(20,45)", 0, 0);
activeSheet.addCustomName("customName3", "=$B$1:$C$1", 0, 0);
activeSheet.setFormula(1, 0, "customName1");
activeSheet.setFormula(1, 1, "customName2");
activeSheet.setFormula(1, 2, "sum(customName3)");


// Create Custom Formulas


// Add Custom function
// Type =myfunc(1)
// in a cell to see the result
function myfunc() { }
myfunc.prototype = new GC.Spread.CalcEngine.Functions.Function("myfunc", 0, 0, {
  name: "myfunc",
  description: "This is my first function"
});
myfunc.prototype.evaluate = function (args) {
  return 100;
}
spread.addCustomFunction(new myfunc())
activeSheet.setFormula(1, 3, "myfunc()");



//公式组件
window.onload = function () {
  // var spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"), { sheetCount: 1 });
  rangeSelector = new GC.Spread.Sheets.FormulaTextBox.FormulaTextBox(document.getElementById("ftb"), { rangeSelectMode: true });
  rangeSelector.workbook(spread);
}
function buttonClick() {
  alert(rangeSelector.text());
}


