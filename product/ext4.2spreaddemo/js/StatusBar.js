
// Customize the status item through GC.Spread.Sheets.StatusBar.StatusItem

var spanItem = new GC.Spread.Sheets.StatusBar.StatusItem('spanItem', { menuContent: 'Current span', value: 'Span test' });
var statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
  document.getElementById('statusBar'),
  { items: [spanItem] }
);
statusBar.bind(spread);



// Customize the status item by extending gc.spread.sheets.statusbar.statusitem

var statusbar = new gc.spread.sheets.statusbar.statusbar(document.getelementbyid('statusbar'));
statusbar.bind(spread);

var statusitem = gc.spread.sheets.statusbar.statusitem;
function labelitem(name, options) {
  statusitem.call(this, name, options);
}
labelitem.prototype = new statusitem();
labelitem.prototype.oncreateitemview = function (container) {
  var item = document.createelement('div');
  item.innertext = this.value;
  item.style.background = 'blue';
  container.addeventlistener('click', function (e) {

    // do click
  });
  container.appendchild(item);
};
labelitem.prototype.onupdate = function () {
  // do something when context menu item check changed
};
statusbar.add(new labelitem('labelitem', { menucontent: 'test label', value: 'test option' }));
