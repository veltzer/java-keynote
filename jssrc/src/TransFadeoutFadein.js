

/**
  @class the fadeout/fadein transition manager
  This transition manager makes the first slide disapper and <b>only then</b>
  makes the second slide appear.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var TransFadeoutFadein = Class.create(/** @lends TransFadeoutFadein# */{
  /**
    Create a new instance of this class.
    @param {object} options configuration for this transition.
    @return {TransFadeoutFadein} A new instance of this class.
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
    @param {Element} element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  postCreate: function(elem) {
    elem.fadeOut(0);
  },
  /**
    transitionIn hook.
    @param {Element} element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionIn: function(elem) {
    elem.fadeIn(this.delay);
  },
  /**
    transitionOut hook.
    @param {Element} element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionOut: function(elem) {
    elem.fadeOut(this.delay);
  },
  /**
    transitionOutIn hook.
    @param {Element} element to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  transitionOutIn: function(elem1, elem2) {
    // for closure
    var object = this;
    elem1.fadeOut(this.delay, function() { elem2.fadeIn(object.delay); });
  }
});

// the slide pages load this as a browser global
window.TransFadeoutFadein = TransFadeoutFadein;
