/*jsl:import LayoutResolver.js*/
/*jsl:import jqutils.js*/
/*jsl:import Utils.js*/


/**
  @class A layout manager that keeps a centralised box of a certain ratio.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var LayoutRatio = Class.create(/** @lends LayoutRatio# */{
  initialize: function(options) {
    checkExact(options, new KeynoteSet('ratio'));
    this.ratio = options.ratio;
    this.element = undefined;
    this.doDebug = false;
  },
  debug: function() {
    if (this.doDebug) {
      jQuery.each(arguments, function(i, msg) {
        Utils.fakeUse(i);
        console.log(msg);
      });
    }
  },
  addElement: function(elem, size) {
    this.debug('addElement ' + elem + ',' + size);
    if (this.element != undefined) {
      throw 'already have element';
    }
    this.element = elem;
  },
  /*
   * This is a the main function.
   * It receives where the widgets under the control
   * of this layout manger should be. It should do the rest.
   */
  resize: function(x, y, width, height) {
    // debug
    this.debug('resize: ' + x + ',' + y + ',' + width + ',' + height);
    // lets check what is the situation...
    if (width / height > this.ratio) {
      var needed_width = height * this.ratio;
      var side_width = (width - needed_width) / 2;
      this.element.posAbs4(x + side_width, y, needed_width, height);
    } else {
      var needed_height = width / this.ratio;
      var side_height = (height - needed_height) / 2;
      this.element.posAbs4(x, y + side_height, width, needed_height);
    }
  }
});


LayoutResolver.getInstance().addLayoutManager('ratio', LayoutRatio);
