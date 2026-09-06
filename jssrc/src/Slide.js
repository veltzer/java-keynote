

/*
  @class a single slide object
  @author mark.veltzer@gmail.com (Mark Veltzer)
 */
var Slide = Class.create(/** @lends Slide# */{
  /**
    creates a new instance of this class.
    @return {Slide} new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    this.title = undefined;
    this.element = undefined;
  },
  /**
    set the element for this slide.
    @param {elem} element instance to use.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  setElement: function(elem) {
    this.element = elem;
  },
  /**
    get the main element for this slide.
    @return {Element} element instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getElement: function() {
    return this.element;
  }
});

// the slide pages load this as a browser global
window.Slide = Slide;
