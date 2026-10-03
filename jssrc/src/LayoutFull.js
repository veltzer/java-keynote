/*jsl:import Utils.js*/
/*jsl:import jqutils.js*/
/*jsl:import LayoutResolver.js*/


/**
  @class A layout manager that only has one child and gives it
  the full size that it gets.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var LayoutFull = Class.create(/** @lends LayoutFull# */{
  initialize: function(options) {
    checkExact(options, new KeynoteSet());
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
    this.element.posAbs4(x, y, width, height);
  }
});


LayoutResolver.getInstance().addLayoutManager('ratio', LayoutFull);
