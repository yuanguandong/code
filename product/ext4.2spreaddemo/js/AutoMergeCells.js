

var data = [
  {
    "Country": "Canada",
    "State": "Ontario",
    "City": "Ottawa",
    "Product": "Kraft Grated Parmesan Cheese"
  },
  {
    "Country": "Canada",
    "State": "Ontario",
    "City": "Belleville",
    "Product": "KIND Bars Almond & Coconut Gluten Free"
  },
  {
    "Country": "Canada",
    "State": "Ontario",
    "City": "Alliston",
    "Product": "Kraft Grated Parmesan Cheese"
  },
  {
    "Country": "Canada",
    "State": "Saskatchewan",
    "City": "Prince Albert",
    "Product": "Smartfood Popcorn"
  },
  {
    "Country": "Canada",
    "State": "Alberta",
    "City": "Red Deer",
    "Product": "Smartfood Popcorn"
  },
  {
    "Country": "Canada",
    "State": "Alberta",
    "City": "Calgary",
    "Product": "Planters Deluxe Whole Cashew"
  },
  {
    "Country": "Canada",
    "State": "Alberta",
    "City": "Calgary",
    "Product": "Kraft Grated Parmesan Cheese"
  },
  {
    "Country": "Canada",
    "State": "Alberta",
    "City": "Okotoks",
    "Product": "Smartfood Popcorn"
  },
  {
    "Country": "India",
    "State": "Andhra Pradesh",
    "City": "Hyderabad",
    "Product": "Teddy Grahams Crackers"
  },
  {
    "Country": "South Africa",
    "State": "Gauteng",
    "City": "Roodepoort",
    "Product": "Jaybee's Gourmet Nuts Gift Pack (3 Lb)"
  },
  {
    "Country": "Finland",
    "State": "Ita-Suomen Laani",
    "City": "Kuopio",
    "Product": "Planters Deluxe Whole Cashew"
  },
  {
    "Country": "Switzerland",
    "State": "Geneve",
    "City": "Vesenaz",
    "Product": "KIND Bars Almond & Coconut Gluten Free"
  },
  {
    "Country": "Switzerland",
    "State": "Vaud",
    "City": "Lausanne",
    "Product": "Smartfood Popcorn"
  },
  {
    "Country": "Switzerland",
    "State": "Vaud",
    "City": "Morges",
    "Product": "Kraft Real Mayo"
  },
  {
    "Country": "Denmark",
    "State": "Frederiksborg",
    "City": "Helsingor",
    "Product": "Planters Deluxe Whole Cashew"
  },
  {
    "Country": "Denmark",
    "State": "Kobenhavn",
    "City": "Kobenhavn",
    "Product": "Kraft Grated Parmesan Cheese"
  },
  {
    "Country": "Denmark",
    "State": "Storstrom",
    "City": "Nakskov",
    "Product": "Kraft Grated Parmesan Cheese"
  }
]
$(document).ready(function () {
  // GC.Spread.Sheets.LicenseKey = "xxx";

  // Initializing Spread
  var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });

  // Get the activesheet
  var activeSheet = spread.getActiveSheet();
  debugger
  // Bind data source
  activeSheet.setRowHeight(0, 30, 1);
  activeSheet.autoGenerateColumns = true;
  activeSheet.setDataSource(data);

  /* Merging complete sheet cells when AutoMergeDirection is set to Column & AutoMergeMode is set to restricted mode */
  var range = new GC.Spread.Sheets.Range(-1, -1, -1, -1);
  activeSheet.autoMerge(range, GC.Spread.Sheets.AutoMerge.AutoMergeDirection.column, GC.Spread.Sheets.AutoMerge.AutoMergeMode.restricted);

  // Set the column width
  for (var c = 0; c < activeSheet.getColumnCount(); c++)
    activeSheet.setColumnWidth(c, 130.0, GC.Spread.Sheets.SheetArea.viewport);

});

