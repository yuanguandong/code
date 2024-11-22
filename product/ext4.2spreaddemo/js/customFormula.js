


var sheet = spread.getSheet(0);

sheet.setValue(1, 1, 'Press \'Add a Custom Function\' button');
sheet.setColumnWidth(1, 225);
sheet.setColumnWidth(2, 100);

function FactorialFunction() {
  this.name = "FACTORIAL";
  this.maxArgs = 1;
  this.minArgs = 1;
}
FactorialFunction.prototype = new GC.Spread.CalcEngine.Functions.Function();
FactorialFunction.prototype.evaluate = function (arg) {
  var result = 1;
  if (arguments.length === 1 && !isNaN(parseInt(arg))) {
    for (var i = 1; i <= arg; i++) {
      result = i * result;
    }
    return result;
  }
  return "#VALUE!";
};
var factorial = new FactorialFunction();

// document.getElementById("addCustomFunction").addEventListener('click', function () {
  sheet.setValue(3, 1, 'Formula');
  sheet.setValue(3, 2, '=factorial(5)');
  sheet.setValue(4, 1, 'Result');
  sheet.addCustomFunction(factorial);
  sheet.setFormula(4, 2, "=factorial(5)");
// });

document.getElementById("removeCustomFunction").addEventListener('click', function () {
  sheet.removeCustomFunction("FACTORIAL");
  sheet.recalcAll(true);
})
