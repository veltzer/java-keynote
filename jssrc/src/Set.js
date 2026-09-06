

/**
  @class a set implemented in javascript.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var Set = Class.create(/** @lends Set# */{
  /**
    Create a new instance of this class.
    @param {any} anything you pass will be a member of the set.
    @return {Set} A new object of this type.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    this.items = {};
    for (var i in arguments) {
      this.add(arguments[i]);
    }
  },
  /**
    Add an element to the set.
    @param {object} o any object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  add: function(o) {
    this.items[o] = true;
  },
  /**
    Remove an element from the set.
    @param {object} o any object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  remove: function(o) {
    delete this.items[o];
  },
  /**
    Check if the set contains an element.
    @param {object} o any object.
    @return {boolean} does the set contain this element.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  hasElem: function(o) {
    return o in this.items;
  },
  /**
    Add all properties of an object to a set.
    @param {object} o any object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  addObject: function(o) {
    for (var prop in o) {
      this.add(prop);
    }
  },
  /**
    Remove all properties of an object from a set.
    @param {object} o any object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  removeObject: function(o) {
    for (var prop in o) {
      this.remove(prop);
    }
  },
  /**
    Clear the set.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  clear: function() {
    this.items = {};
  },
  /**
    Create a string representation of the set.
    @return {String} a string representing this set.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    var a = [];
    for (var x in this.items) {
      a.push(x);
    }
    return a.join(',');
  },
  /**
    Run a function for each memeber of the set
    @param {Function} func the function to run.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  foreach: function(func) {
    for (var x in this.items) {
      func(x);
    }
  }
});

// the slide pages load this as a browser global
window.Set = Set;
