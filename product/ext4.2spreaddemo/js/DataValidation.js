
// Setting column width        

sheet.setColumnWidth(1, 100.0, GC.Spread.Sheets.SheetArea.viewport);
sheet.setColumnWidth(3, 100.0, GC.Spread.Sheets.SheetArea.viewport);
sheet.setColumnWidth(5, 100.0, GC.Spread.Sheets.SheetArea.viewport);

// Set the option highlightInvalidData method to true

spread.options.highlightInvalidData = true;

// For circle highlightStyle
sheet.setValue(1, 1, "Juice");
var dv1 = new GC.Spread.Sheets.DataValidation.createListValidator('Fruit,Vegetable,Food');
dv1.highlightStyle({
  type: GC.Spread.Sheets.DataValidation.HighlightType.circle,
  color: 'red'
});
sheet.setDataValidator(1, 1, dv1);

// For dog-ear highlightStyle
sheet.setValue(1, 3, "Juice");
var dv2 = new GC.Spread.Sheets.DataValidation.createListValidator('Fruit,Vegetable,Food');
dv2.highlightStyle({
  type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
  color: 'orange',
  position: GC.Spread.Sheets.DataValidation.HighlightPosition.topLeft
});
sheet.setDataValidator(1, 3, dv2);

// For icon highlightStyle

var imageData =

  "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5ElEQVRYR8WXPUxTURTH//" +
  "8nbYE6YIKSCH70lcbEVOOgMTGokw7E2cVVcDQmCrzi0IFQICbGTcXVTRcDiXEiDBojmmifRCgtjYKDYsAQ0g + gx7xXadry0dfyQt / U5J57zu + c23vu /" +
  "xAWvx8td + r + OuvbhXKdEJ + AjYQcEkEGxB8KFwB8g8hLt7hGPPFg0oprljKKtGoHU8J + EblBsq6UvbEuIgmSz12UgG8m9HunPdsCCII1uifdDYp" +
  "G0m0lcLGNiKxAGPLPOgeJ4NpWPrYE + HK05wAdygiBC5UE3gQCvJXVzLXT3wcWi9c2AUyq930ZrL8BedyO4DkfInEF + 66ejPVF8v0WAIQ9gSYo + Eig2dbgG85E4" +
  "o6k69yJn0HjD2t + OYDPTXfditvxjuSpksEFSaG8L8hEeB5Ebam9IphoSCcuHZl7mCgA0FVtEGRXKQfmukjcHwt58m11VZu1fGyCQX + svycHMNXS27zqlBkrGdgEk" +
  "HSl1ny++aE58wh0b2AYwE1L2dtRgWygZ / 5ofwe / IujMqKklq03Glgr8b1ZKzNXASVVrz5CjlrO3rwLGDWhnWNUek7xVDQARecKwVxsjeLkaAICMUVcD0yB8VQEQm" +
  "WZYDayQqK8KAGSZujewDGB / FQG0CMDWqgAIItRVbRzkxXIARLAE4FHRntskGsr0M17ZNSwnyg625jWsqBHZBGA2omwrTi + WcxPsOAJDN5qtOPsYaU8BdlhObLfPc" +
  "fZBGfZHQ50mgKGESMT38jmuZfpYa / TBr5wi0r2BIQD3LFVhtxUQGfLHQt05QWL8MAaPJWfdOImzJSF2I8mATw2pRNsmSWYEnTocbFytTX2wLK1KkhYaCDDvTDjPbCl" +
  "KN0wNWb7O9dcE1TL972wuEgflij86MJNvuO1gotQor0C02QEh5QwmGwEn0OlweRq7QOktS67lEVc8muVnbV5RBX17PpwWl3678RxCEcpCbjwHX7gzjlGr4 / k / MV" +
  "GWHUHnf3sAAAAASUVORK5CYII = ";

sheet.setValue(1, 5, "Juice");
var dv3 = new GC.Spread.Sheets.DataValidation.createListValidator('Fruit,Vegetable,Food');
dv3.highlightStyle({
  type: GC.Spread.Sheets.DataValidation.HighlightType.icon,
  color: 'blue',
  position: GC.Spread.Sheets.DataValidation.HighlightPosition.outsideLeft,
  image: imageData
});
sheet.setDataValidator(1, 5, dv3);
