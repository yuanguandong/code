// Initializing Spread
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });
// Get the activesheet
var activeSheet = spread.getActiveSheet();

var comment = activeSheet.comments.add(5, 5, "new comment!");
comment.text("new comment!");
comment.backColor("red");
comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.AlwaysShown);