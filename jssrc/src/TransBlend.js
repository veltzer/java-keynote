

/**
  @class the fadeout/fadein transition manager
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var TransBlend = Class.create(/** @lends TransBlend# */{
  /**
    Create a new instance of this class.
    @param {object} configuration options.
    @return {TransBlend} a new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(options) {
    if (!('delay' in options)) {
      options.delay = 1000;
    }
    this.delay = options.delay;
  },
  /**
    postCreate hook.
    @param {Element} elem the element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  postCreate: function(elem) {
    elem.fadeOut(0);
  },
  /**
    transitionIn hook.
    @param {Element} elem the element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionIn: function(elem) {
    elem.fadeIn(this.delay);
  },
  /**
    transitionOut hook.
    @param {Element} elem the element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionOut: function(elem) {
    elem.fadeOut(this.delay);
  },
  /**
    transitionOutIn hook.
    @param {Element} elem1 the element that is going out.
    @param {Element} elem2 the element that is going in.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionOutIn: function(elem1, elem2) {
    elem1.fadeOut(this.delay);
    elem2.fadeIn(this.delay);
  }
});

// the slide pages load this as a browser global
window.TransBlend = TransBlend;
