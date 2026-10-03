/*jsl:import Utils.js*/
/*jsl:import jqutils.js*/
/*jsl:import Slide.js*/
/*jsl:import LayoutResolver.js*/
/*jsl:import TransHideShow.js*/


/**
  @class The presentation manager object
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var Mgr = Class.create(/** @lends Mgr# */{
  initialize: function(options) {
    /*
     * Options section
     */
    checkHasOnly(options, new KeynoteSet('source', 'transition'));
    checkMustHave(options, new KeynoteSet('source'));
    this.source = options.source;
    if (!('transition' in options)) {
      this.transition = new TransHideShow();
    } else {
      this.transition = options.transition;
    }
    this.doDebug = false;
    // should we do real <a> or <div> with callbacks
    this.doRealLinks = false;
    // should we actually redirect anywhere ?
    this.doClickableLinks = false;

    /*
     * Code starts here
     */

    this.startWait();
    this.currentSlideNum = -1;
    this.slides = [];
    this.old_width = undefined;
    this.old_height = undefined;
    this.topElem = jQuery(document.body);
    // for closure
    var object = this;
    var ajax = jQuery.get(
        options.source,
        '',
        function(doc) {
          object.buildUp(doc);
          object.hookKeyboard();
          Mgr.highlight();
          object.hookResize();
          object.stopWait();
          object.resize(true);
          object.gotoBegin();
        },
        'xml'
        );
    ajax.error(function(ajax_object, error_string, t) {
      Utils.fakeUse(ajax_object);
      document.write('bad presentation with error [' + error_string + '][' +
          String(t).substring(0, 40) + ']');
      object.stopWait();
    });
  },
  debug: function() {
    if (this.doDebug) {
      jQuery.each(arguments, function(i, msg) {
        Utils.fakeUse(i);
        console.log(msg);
      });
    }
  },
  hookResize: function() {
    // for closure
    var object = this;
    jQuery(window).resize(function() {
      //object.resize(false);
      object.resize(true);
    });
    // now lets call resize once ourselves...
    object.resize(true);
  },
  resize: function(force) {
    //this.debug('resize',jQuery(window).width(),jQuery(window).height());
    if (jQuery(window).width() != this.old_width || jQuery(window).height() !=
        this.old_height || force) {
      this.debug('real resize');
      this.old_width = jQuery(window).width();
      this.old_height = jQuery(window).height();
      jQuery.each(this.slides, function(i, slide) {
        Utils.fakeUse(i);
        slide.getElement().data('layout').resize(0, 0, jQuery(window).width(),
            jQuery(window).height());
      });
    }
  },
  hookKeyboard: function() {
    // for closure
    var object = this;
    var onefunc = function(e) {
      //object.debug(e.keyCode,e.which);
      // 32 is space, 39 is right arrow, 34 is page down, 40 is down
      if (e.keyCode == 32 || e.keyCode == 39 || e.keyCode == 34 ||
          e.keyCode == 40) {
        object.gotoNext();
        e.preventDefault();
      }
      // 8 is backspace, 37 is left arrow, 33 is page up, 38 is up
      if (e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 33 ||
          e.keyCode == 38) {
        object.gotoPrev();
        e.preventDefault();
      }
      // 36 is Home
      if (e.keyCode == 36) {
        object.gotoBegin();
        e.preventDefault();
      }
      // 35 is End
      if (e.keyCode == 35) {
        object.gotoEnd();
        e.preventDefault();
      }
    };
    // DONT catch the event on 'body' since it does not capture key
    // strokes in all browsers catching on the document is the best thing...
    jQuery(document).keydown(onefunc);
  },
  createElement: function(node) {
    // for closure
    var object = this;
    // debug
    //this.debug(node.nodeType);
    // 3 means text node
    if (node.nodeType == 3) {
      throw 'I dont think I should be here ' + node.textContent;
    }
    // 1 means element
    if (node.nodeType == 1) {
      if (node.localName == 'code') {
        Mgr.checkOneChild(node);
        var e_item_div = jQuery('<div/>');
        var e_code = jQuery('<pre/>');
        if (node.hasAttribute('language')) {
          e_code.addClass('brush: ' + node.getAttribute('language'));
        }
        e_code.text(node.textContent);
        e_item_div.append(e_code);
        return e_item_div;
      }
      if (node.localName == 'concept' || node.localName == 'emphasis') {
        Mgr.checkOneChild(node);
        var e_item_concept = jQuery('<span/>');
        e_item_concept.addClass(node.localName);
        e_item_concept.text(node.textContent);
        return e_item_concept;
      }
      if (node.localName == 'image') {
        Mgr.checkNoChildren(node);
        // TODO: what about the height and width of the images ?
        var e_item_img = jQuery('<img/>');
        e_item_img.error(function() {
          // currently do nothing on image load error
        });
        e_item_img.attr({
          src: node.getAttribute('url'),
          alt: node.getAttribute('description')
        });
        e_item_img.addClass(node.localName);
        return e_item_img;
      }
      if (node.localName == 'email') {
        Mgr.checkOneChild(node);
        if (this.doRealLinks) {
          var e_item_a = jQuery('<a/>', {
            href: 'mailto:' + node.textContent
          });
          e_item_a.addClass(node.localName);
          e_item_a.text(node.textContent);
          return e_item_a;
        } else {
          var e_item_span = jQuery('<span/>');
          e_item_span.addClass(node.localName);
          e_item_span.addClass('fakemail');
          if (this.doClickableLinks) {
            e_item_span.click(function(e) {
              Utils.fakeUse(e);
              window.location = 'mailto:' + node.textContent;
            });
          }
          e_item_span.text(node.textContent);
          return e_item_span;
        }
      }
      var type;
      if (node.localName == 'title' || node.localName == 'bullet') {
        type = '<span/>';
      } else {
        type = '<div/>';
      }
      // non atomics (all others: title, bullet)
      var e_item_full = jQuery(type, {
        position: 'absolute', // to make sure it's absolute
        marginLeft: 0, // to make sure there are no margins
        marginTop: 0 // to make sure there are no margins
      });
      e_item_full.addClass(node.localName);
      var layout;
      if (node.hasAttribute('layout') || node.localName == 'slide') {
        var l_type;
        if (node.hasAttribute('layout')) {
          l_type = node.getAttribute('layout');
        } else {
          l_type = 'flow';
        }
        var config = { lines: 11 };
        layout = LayoutResolver.getInstance().createLayoutManager(
            l_type, config);
        e_item_full.data('layout', layout);
      }
      jQuery.each(node.childNodes, function(index, child) {
        Utils.fakeUse(index);
        if (child.nodeType != 3 && child.nodeType != 1) {
          return;
        }
        // no text under slides
        if (node.localName == 'slide' && child.nodeType == 3) {
          //object.debug(child);
          return;
        }
        if ((node.localName == 'title' || node.localName == 'bullet') &&
            child.nodeType == 3) {
          e_item_full.append(child.textContent);
          return;
        }
        // recursion
        var newElement = object.createElement(child);
        e_item_full.append(newElement);
        if (node.hasAttribute('layout') || node.localName == 'slide') {
          layout.addElement(newElement);
        }
      });
      return e_item_full;
    }
    throw 'I really should not be here ' + node;
  },
  buildUp: function(doc) {
    // for closure
    var object = this;
    this.title = Mgr.getTextFromSingleXpath(doc, '/presentation/meta/title');
    this.copyright = Mgr.getTextFromSingleNode(doc, 'copyright');
    // create the various pages
    jQuery.each(doc.getElementsByTagName('slide'), function(index, slide) {
      Utils.fakeUse(index);
      var s = new Slide();
      s.setElement(object.createElement(slide));
      object.slides.push(s);
      object.topElem.append(s.getElement());
      object.transition.postCreate(s.getElement());
    });
  },
  getCurrentSlide: function() {
    return this.slides[this.currentSlideNum];
  },
  getCurrentElement: function() {
    return this.getCurrentSlide().getElement();
  },
  getSlideNum: function() {
    return this.slides.length;
  },
  startWait: function() {
    document.body.style.cursor = 'wait';
    document.title = 'loading...';
  },
  stopWait: function() {
    document.body.style.cursor = 'default';
    document.title = this.title;
  },
  gotoSlide: function(num) {
    if (num >= 0 && num < this.getSlideNum() && num != this.currentSlideNum) {
      if (this.currentSlideNum != -1) {
        var elem1 = this.getCurrentElement();
        this.currentSlideNum = num;
        var elem2 = this.getCurrentElement();
        this.transition.transitionOutIn(elem1, elem2);
      } else {
        this.currentSlideNum = num;
        this.transition.transitionIn(this.getCurrentElement());
      }
    }
    this.resize(true);
  },
  gotoNext: function() {
    this.gotoSlide(this.currentSlideNum + 1);
  },
  gotoPrev: function() {
    this.gotoSlide(this.currentSlideNum - 1);
  },
  gotoBegin: function() {
    this.gotoSlide(0);
  },
  gotoEnd: function() {
    this.gotoSlide(this.getSlideNum() - 1);
  }
});


/**
  TODO
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Mgr.highlight = function() {
  function path() {
    var args = arguments;
    var result = [];
    for (var i = 0; i < args.length; i++) {
      result.push(args[i].replace('@', 'toolkits/sh/scripts/'));
    }
    return result;
  }
  SyntaxHighlighter.autoloader.apply(null, path(
      'applescript @shBrushAppleScript.js',
      'actionscript3 as3 @shBrushAS3.js',
      'bash shell @shBrushBash.js',
      'coldfusion cf @shBrushColdFusion.js',
      'cpp c @shBrushCpp.js',
      'c# c-sharp csharp @shBrushCSharp.js',
      'css @shBrushCss.js',
      'delphi pascal @shBrushDelphi.js',
      'diff patch pas @shBrushDiff.js',
      'erl erlang @shBrushErlang.js',
      'groovy @shBrushGroovy.js',
      'java @shBrushJava.js',
      'jfx javafx @shBrushJavaFX.js',
      'js jscript javascript @shBrushJScript.js',
      'perl pl @shBrushPerl.js',
      'php @shBrushPhp.js',
      'text plain @shBrushPlain.js',
      'py python @shBrushPython.js',
      'ruby rails ror rb @shBrushRuby.js',
      'sass scss @shBrushSass.js',
      'scala @shBrushScala.js',
      'sql @shBrushSql.js',
      'vb vbnet @shBrushVb.js',
      'xml xhtml xslt html @shBrushXml.js'
      ));
  SyntaxHighlighter.defaults['toolbar'] = false;
  SyntaxHighlighter.all();
};


/**
  Get text from a DOM document using a single xpath expression.
  @param {DOM} doc the document to work on.
  @param {String} xpath_expr the expression to use.
  @return {String} the text of the node in question.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Mgr.getTextFromSingleXpath = function(doc, xpath_expr) {
  Utils.fakeUse(doc);
  Utils.fakeUse(xpath_expr);
  var l = doc.evaluate(xpath_expr, doc.documentElement, null,
      window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if (l.snapshotLength != 1) {
    return '[-----------no title-------------]';
    //throw 'wrong number (' + l.snapshotLength + ') of elements for expr ' +
    //    xpath_expr;
  } else {
    return l.snapshotItem(0).textContent;
  }
};


/**
  Get text from a single XML node.
  @param {DOM} doc the document to work on.
  @param {object} name the tag name to get the text from.
  @return {String} the text of the node in question.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Mgr.getTextFromSingleNode = function(doc, name) {
  var l = doc.getElementsByTagName(name);
  if (l.length != 1) {
    return '[-----------no copyright-------------]';
    //throw 'wrong number (' + l.length + ') of elements of type ['
    //+ name + ']';
  } else {
    return l[0].textContent;
  }
};


/**
  @param {DOMNODE} node The node to check.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Mgr.checkOneChild = function(node) {
  if (node.nodeType != 3 && node.childNodes.length != 1) {
    throw 'wrong number of childern for node ' + node;
  }
};


/**
  Get the single child of a DOM node.
  @param {DOMNODE} node the node in question.
  @return {DOMNODE} the single child of the node in question.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Mgr.getOneChild = function(node) {
  Mgr.checkOneChild(node);
  return node.childNodes[0];
};


/**
  @param {DOMNODE} node The node to check.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Mgr.checkNoChildren = function(node) {
  if (node.childNodes.length != 0) {
    throw 'too many children for node ' + node;
  }
};
