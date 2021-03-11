// Initializing Spread
var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });

// Get the activesheet
var activeSheet = spread.getActiveSheet();


 //Set the Workflow list dropdown
let workflowListStyle = new GC.Spread.Sheets.Style();
workflowListStyle.cellButtons = [
{
imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
command: "openWorkflowList",
useButtonStyle: true,
}
];
workflowListStyle.dropDowns = [
{
type: GC.Spread.Sheets.DropDownType.workflowList,
option: {
  items: [
  { value: "New", transitions: [1] },
  { value: "Open", transitions: [0, 2, 3, 5] },
  { value: "In Progress", transitions: [1, 3, 5] },
  { value: "Resolved", transitions: [5, 4] },
  { value: "Reopened", transitions: [5, 3, 2] },
  { value: "Closed", transitions: [4] },
  ]
}
}
];
activeSheet.setText(16, 3, "Workflow List Dropdown");
activeSheet.setStyle(16, 4, workflowListStyle);