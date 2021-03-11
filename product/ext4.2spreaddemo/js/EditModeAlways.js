spread.bind(GC.Spread.Sheets.Events.EnterCell, function (event, data) {
  var sheet = data.sheet;
  activeSheet.startEdit(false);
});