/*jsl:import LayoutResolver.js*/
/*jsl:import jqutils.js*/
/*jsl:import Utils.js*/


/**
  @class This is a layout manager that divides it's vertical space
  in a relative way.
  This object must receive orientation as parameter in the config.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var LayoutRelative = Class.create(/** @lends LayoutRelative# */{
  initialize: function(options) {
    checkHasOnly(options, new KeynoteSet('orientation'));
    this.checkOrientation(options.orientation);
    this.orientation = options.orientation;
    this.elements = [];
    this.sizes = [];
    this.doDebug = false;
    this.debug('created LayoutRelative');
  },
  checkOrientation: function(orientation) {
    if (!(orientation in LayoutRelative.orientation)) {
      throw 'bad orientation ' + orientation;
    }
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
    this.elements.push(elem);
    this.sizes.push(size);
  },
  checkAddToOne: function() {
    var sum = 0;
    jQuery.each(this.sizes, function(i, size) {
      Utils.fakeUse(i);
      sum += size;
    });
    if (checkCloseTo(sum, 1, 0.00001)) {
      throw 'sum!=1, sum=' + sum;
    }
  },
  /**
    This is a the main function. It receives where the widgets under the control
    of this layout manger should be. It should do the rest.
    @param {Number} x x coordinate.
    @param {Number} y y coordinate.
    @param {Number} width width of the resize.
    @param {Number} height height of the resize.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  resize: function(x, y, width, height) {
    // for closure
    var object = this;
    // round up
    x = Math.round(x);
    y = Math.round(y);
    width = Math.round(width);
    height = Math.round(height);
    // debug
    this.debug('resize: ' + x + ',' + y + ',' + width + ',' + height);
    this.debug('this.elements.length: ' + this.elements.length);
    this.checkAddToOne();
    if (this.orientation == 'vertical') {
      var y_start = y;
      jQuery.each(this.elements, function(i, element) {
        var size = object.sizes[i];
        var cur_size = Math.round(height * size);
        //var cur_size=height*size;
        element.posAbs4(x, y_start, width, cur_size);
        y_start += cur_size;
      });
    } else {
      var x_start = x;
      jQuery.each(this.elements, function(i, element) {
        var size = object.sizes[i];
        var cur_size = Math.round(width * size);
        //var cur_size=width*size;
        element.posAbs4(x_start, y, cur_size, height);
        x_start += cur_size;
      });
    }
  }
});


/**
  Object that containes the various orientations.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
LayoutRelative.orientation = {
  horizontal: null,
  vertical: null
};
LayoutResolver.getInstance().addLayoutManager('relative', LayoutRelative);
