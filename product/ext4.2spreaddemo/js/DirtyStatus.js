var customers = [
  { ID: 0, Name: 'A', Info1: 'Info0' },
  { ID: 1, Name: 'B', Info1: 'Info1' },
  { ID: 2, Name: 'C', Info1: 'Info2' },
];
activeSheet.setDataSource(customers);

$("#button1").click(function () {
  debugger
  activeSheet.clearPendingChanges();
});

// Add button control to page


