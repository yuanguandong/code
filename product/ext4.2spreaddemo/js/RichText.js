
var SpreadJS =
{
  richText: [{
    style: {
      font: "bold 36px Calibri",
      foreColor: "rgb(78,133,242)"
    },
    text: "S"
  },
  {
    style: {
      font: "bold 36px Calibri",
      foreColor: "rgb(228,65,52)"
    },
    text: "p"
  },
  {
    style: {
      font: "bold 36px Calibri",
      foreColor: "rgb(247,188,32)"
    },
    text: "r"
  },
  {
    style: {
      font: "bold 36px Calibri",
      foreColor: "rgb(78,133,242)"
    },
    text: "e"
  },
  {
    style: {
      font: "bold 36px Calibri",
      foreColor: "rgb(65,168,87)"
    },
    text: "a"
  },
  {
    style: {
      font: "bold 36px Calibri",
      foreColor: "rgb(228,65,54)"
    },
    text: "d"
  }
  ]
};

var sJS =
{
  richText: [
    {
      style: {
        font: "bold 24px Calibri",
        foreColor: "rgb(78,133,242)"
      },
      text: "S"
    },
    {
      style: {
        font: "bold 24px Calibri",
        foreColor: "rgb(65,168,87)"
      },
      text: "p"
    },
    {
      style: {
        font: "bold 24px Calibri",
        foreColor: "rgb(247,188,32)"
      },
      text: "r"
    },
    {
      style: {
        font: "bold 24px Calibri",
        foreColor: "rgb(78,133,242)"
      },
      text: "e"
    },
    {
      style: {
        font: "bold 24px Calibri",
        foreColor: "rgb(65,168,87)"
      },
      text: "a"
    },
    {
      style: {
        font: "bold 24px Calibri",
        foreColor: "rgb(228,65,54)"
      },
      text: "d"
    }
  ]
};



var sheet = spread.getActiveSheet();

// Apply rich text in a cell in the viewport

sheet.setValue(3, 0, SpreadJS, 3);
sheet.setValue(2, 2, sJS, GC.Spread.Sheets.SheetArea.viewport);

// Apply rich text to the column header cell

sheet.setValue(0, 4, { richText: [{ style: { font: 'bold 36px Arial ', foreColor: 'blue' }, text: 'Spread' }] }, GC.Spread.Sheets.SheetArea.colHeader);
sheet.setValue(0, 1, SpreadJS, GC.Spread.Sheets.SheetArea.colHeader);

// Apply rich text to a cell in the row header

sheet.setValue(2, 0, sJS, GC.Spread.Sheets.SheetArea.rowHeader);
