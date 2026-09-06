/*jsl:import Utils.js*/


/**
  @class the hide/show transition manager.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var TransHideShow = Class.create(/** @lends TransHideShow# */{
  /**
    Create a new instance of this class.
    @param {object} configuration options.
    @return {TransHideShow} a new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(options) {
    Utils.fakeUse(options);
  },
  /**
    postCreate hook.
    @param {Element} elem the element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  postCreate: function(elem) {
    elem.hide();
  },
  /**
    transitionIn hook.
    @param {Element} elem the element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionIn: function(elem) {
    elem.show();
  },
  /**
    transitionOut hook.
    @param {Element} elem the element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionOut: function(elem) {
    elem.hide();
  },
  /**
    transitionOutIn hook.
    @param {Element} elem1 the element that is going out.
    @param {Element} elem2 the element that is going in.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionOutIn: function(elem1, elem2) {
    elem1.hide();
    elem2.show();
  }
});

// the slide pages load this as a browser global
window.TransHideShow = TransHideShow;
