/*jsl:import jqutils.js*/
/*jsl:import LayoutFull.js*/
/*jsl:import LayoutRelative.js*/
/*jsl:import LayoutRatio.js*/
/*jsl:import LayoutFlow.js*/


/**
  @class A template with titles and bullets
  Layout:
    d1
      dcenter
    d2
      d4 d5 d6
    d3
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var TemplateTitleBullets = Class.create(/** @lends TemplateTitleBullets# */{
  /**
    Create a new instance of this class.
    @param {object} options configuration options.
    @return {TemplateTitleBullets} A new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(options) {
    // for closure
    var object = this;
    // handle arguments
    checkHasOnly(options, new Set('id'));
    this.id = options.id;

    // create the structure
    this.d_top = jQuery('<div/>').addClass('templateTop');

    this.layout = new LayoutFull();
    this.layout.addElement(this.d_top);

    this.ld_top = new LayoutRatio({
      ratio: 1.33
    });
    this.d_top.data('layout', this.ld_top);

    this.d = jQuery('<div/>').addClass('templateSlide');
    this.d_top.append(this.d);
    this.ld_top.addElement(this.d);

    this.ld = new LayoutRelative({
      orientation: 'vertical'
    });
    this.d.data('layout', this.ld);

    this.d1 = jQuery('<div/>').addClass('template1');
    this.d2 = jQuery('<div/>').addClass('template2');
    this.d3 = jQuery('<div/>').addClass('template3');
    this.d.append(this.d1);
    this.d.append(this.d2);
    this.d.append(this.d3);
    this.ld.addElement(this.d1, 0.23);
    this.ld.addElement(this.d2, 0.67);
    this.ld.addElement(this.d3, 0.10);

    this.d4 = jQuery('<div/>').addClass('template4');
    this.d5 = jQuery('<div/>').addClass('template5');
    this.d6 = jQuery('<div/>').addClass('template6');
    this.d2.append(this.d4);
    this.d2.append(this.d5);
    this.d2.append(this.d6);
    this.ld2 = new LayoutRelative({
      orientation: 'horizontal'
    });
    this.ld2.addElement(this.d4, 0.08);
    this.ld2.addElement(this.d5, 0.84);
    this.ld2.addElement(this.d6, 0.08);
    this.d2.data('layout', this.ld2);

    // connect the flow layout
    this.ld5 = new LayoutFlow({ lines: 10 });
    this.d5.data('layout', this.ld5);
    // connect the flow layout
    this.ld1 = new LayoutFlow({ lines: 1 });
    this.d1.data('layout', this.ld1);

    // handle resizes
    this.resize();
    jQuery(window).resize(function() {
      object.resize();
    });
    // append
    jQuery(this.id).append(this.d_top);
  },
  /**
    Add an title or bullet to this template.
    @param {String} role the role of the element (title or bullet).
    @param {Element} element the element to add.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  addElement: function(role, element) {
    if (role == 'title') {
      this.d1.append(element);
      this.ld1.addElement(element);
      this.resize();
    }
    if (role == 'bullet') {
      this.d5.append(element);
      this.ld5.addElement(element);
      this.resize();
    }
  },
  /**
    Method to handle resizing events for this template.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  resize: function() {
    this.layout.resize(0, 0, jQuery(window).width(), jQuery(window).height());
  }
});

// the slide pages load this as a browser global
window.TemplateTitleBullets = TemplateTitleBullets;
