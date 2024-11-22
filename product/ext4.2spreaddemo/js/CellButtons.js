
$(document).ready(function () {
  // Configure Workbook and Worksheet
  var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
    sheetCount: 1
  });
  var activeSheet = spread.getActiveSheet();
  activeSheet.setColumnWidth(3, 300);
  activeSheet.setColumnWidth(4, 200);

  // Add a basic button with caption
  var basicButttonStyle = new GC.Spread.Sheets.Style();
  basicButttonStyle.cellButtons = [
    {
      caption: "Insert"
    }
  ];
  activeSheet.setText(2, 3, "Basic button with caption");
  activeSheet.setStyle(2, 4, basicButttonStyle);

  // Add button with different configuration settings such as position, style, enabled/disabled
  var customButtonStyle = new GC.Spread.Sheets.Style();
  customButtonStyle.cellButtons = [
    {
      caption: "enable",
      useButtonStyle: true,
      enabled: true,
      position: GC.Spread.Sheets.ButtonPosition.left
    },
    {
      caption: "disabled",
      useButtonStyle: false,
      enabled: false,
      position: GC.Spread.Sheets.ButtonPosition.right
    }
  ];
  activeSheet.setText(4, 3, "enabled/disabled buttons");
  activeSheet.setStyle(4, 4, customButtonStyle);

  // Add button with built-in and custom image
  var ImageStyle = new GC.Spread.Sheets.Style();
  ImageStyle.cellButtons = [
    {
      useButtonStyle: true,
      imageSize: {
        height: 8,
        width: 8
      },
      imageType: GC.Spread.Sheets.ButtonImageType.ellipsis
    },
    {
      useButtonStyle: true,
      imageType: GC.Spread.Sheets.ButtonImageType.custom,
      imageSrc: "data:image/bmp;base64,Qk1eAAAAAAAAAD4AAAAoAAAACAAAAAgAAAABAAEAAAAAACAAAADEDgAAxA4AAAAAAAAAAAAAAAAAAP///wB+AAAApQAAANsAAAClAAAApQAAANsAAAClAAAAfgAAAA=="
    }
  ];
  activeSheet.setText(6, 3, "Image Buttons");
  activeSheet.setStyle(6, 4, ImageStyle);

  // Add Dropdown button with command action
  var dropdownStylecommand = new GC.Spread.Sheets.Style();
  dropdownStylecommand.cellButtons = [
    {
      imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
      command: "openColorPicker"
    }
  ];
  activeSheet.setText(8, 3, "Dropdown button with command");
  activeSheet.setStyle(8, 4, dropdownStylecommand);

  // Add Dropdown button with command function
  var dropdownStylefunction = new GC.Spread.Sheets.Style();
  dropdownStylefunction.cellButtons = [
    {
      imageType: GC.Spread.Sheets.ButtonImageType.search,
      command: (sheet, row, col, option) => {
        if (sheet.zoom() === 1) {
          sheet.zoom(1.5);
        } else {
          sheet.zoom(1);
        }
      }
    }
  ];
  activeSheet.setText(10, 3, "Dropdown button with command funcation");
  activeSheet.setStyle(10, 4, dropdownStylefunction);
});
