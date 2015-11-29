/*
 BuoyantJS v1.4.0
 (c) 2013-2015 by Depth Development. http://depthdev.com
 License: Apache 2.0
*/


'use strict';



//////////////////////////////////////
//
//  $Buoyant Library
//
//////////////////////////////////////
var $Buoyant = function(elements, selector) { this.elems = elements; this.selector = selector; }; // $BUOYANT GLOBAL OBJECT


  // // TEMPLATE ONLY FOR COPYING AND PASTING NEW METHODS!
  // $Buoyant.prototype.template = function(template) {
  //   for (var i=0,l=this.elems.length;i<l;i++) {
  //     this.elems[i].template = template;
  //   }
  //   return this;
  // };

  
  // PROTOTYPE METHODS:


  //// ADD CLASS
  $Buoyant.prototype.addClass = function(classNames) {
    if (classNames === '' || classNames === ' ') {
      return this;
    } else {
      var classes = classNames.split(/[,\s]+/g);
      for (var i=0,l=this.elems.length;i<l;i++) {
        for (var ii=0,ll=classes.length;ii<ll;ii++) {

          if (!new RegExp('^' + classes[ii]).test(this.elems[i].className) && !new RegExp('\\s' + classes[ii] + '$').test(this.elems[i].className) && !new RegExp('\\s' + classes[ii] + '\\s').test(this.elems[i].className)) {
            if (this.elems[i].className === '') {
              this.elems[i].className += classes[ii];
            } else {
              this.elems[i].className += ' ' + classes[ii];
            }
          }
        }
      }
    }
    return this;
  };
  //// ATTRIBUTE
  $Buoyant.prototype.attr = function(attr, value) {
    var result = '';
    if (value) {
      for (var i=0,l=this.elems.length;i<l;i++) {
        this.elems[i].setAttribute(attr, value);
      }
      return this;
    } else {
      for (var i=0,l=this.elems.length;i<l;i++) {
        result += this.elems[i].getAttribute(attr);
      }
      return result;
    }
  };
  //// CHILD
  $Buoyant.prototype.child = function(index) {
    var a = [];
    for (var i=0,l=this.elems.length;i<l;i++) {
      a[i] = this.elems[i].children[index];
    }
    return new $Buoyant(a);
  };
  //// CHILDREN
  $Buoyant.prototype.children = function() {
    var a = [];
    for (var i=0,l=this.elems.length;i<l;i++) {
      var nl = this.elems[i].parentElement.children;
      for (j = 0, m = nl.length; j < m; j++) {
        a[j] = nl[j];
      }
    }
    return new $Buoyant(a);
  };
  //// CSS
  $Buoyant.prototype.css = function(propOrObjOrText, valOrMs, ms) {
    var that = this.elems;
    function run(style) {
      for (var i=0,l=that.length;i<l;i++) {
        that[i].style.cssText = style;
      }
    } // End run
    if (typeof propOrObjOrText === 'string' && valOrMs === undefined) {
      (ms) ? setTimeout(function() { run(propOrObjOrText); },ms) : run(propOrObjOrText);
    } else if (typeof propOrObjOrText === 'object') {
      var style = JSON.stringify(propOrObjOrText).replace(/[\{\}"']*/g,'').replace(/,/g,';') + ';';
      (valOrMs) ? setTimeout(function() { run(style); },valOrMs) : run(style);
    } else {
      var style = propOrObjOrText + ':' + valOrMs + ';';
      (ms) ? setTimeout(function() { run(style); },ms) : run(style);
    }
    return this;
  };
  //// EACH
  $Buoyant.prototype.each = function(func) {
    for (var i=0,l=this.elems.length;i<l;i++) {
      this.elems[i].temp = func;
      this.elems[i].temp();
    }
    return this;
  };
 //// EMPTY
 $Buoyant.prototype.empty = function() {
  for (var i=0,l=this.elems.length;i<l;i++) {
    this.elems[i].innerHTML = '';
  }
  return this;
};
  //// EQ
  $Buoyant.prototype.eq = function(index) {
    return new $Buoyant([this.elems[index]]);
  };
  //// EXISTS
  $Buoyant.prototype.exists = function() {
    return this.elems.length > 0 ? true : false;
  };
 //// FADE IN
 $Buoyant.prototype.fadeIn = function(ms) {
  for (var i=0,l=this.elems.length;i<l;i++) {
    this.elems[i].style.opacity = 0;
    this.elems[i].style.display = 'block';
    var that = this.elems[i],
    opacity = 0,
    amount = 1 / ms * 30;
    function fade_in() {
      if (opacity < 1) {
        that.style.opacity = opacity;
        opacity += amount;
        setTimeout(function(){fade_in()}, 30);
      } else {
        that.style.opacity = 1;
      }
    }
    fade_in();
  }
  return this;
};
  //// FADE OUT
  $Buoyant.prototype.fadeOut = function(ms) {
    for (var i=0,l=this.elems.length;i<l;i++) {
      var that = this.elems[i],
      opacity = 1,
      amount = 1 / ms * 30;
      function fade_out() {
        if (opacity > 0) {
          that.style.opacity = opacity;
          opacity -= amount;
          setTimeout(function(){fade_out()}, 30);
        } else {
          that.style.opacity = 0;
          that.style.display = 'none';
        }
      }
      fade_out();
    }
    return this;
  };
  //// FIND
  $Buoyant.prototype.find = function(selector) {
    return new $Buoyant(this.nodeListToArray(this.selector + ' ' + selector));
  };
  //// FOCUS
  $Buoyant.prototype.focus = function() {
    this.elems[0].focus();
    return this;
  };
 //// HAS CLASS
 $Buoyant.prototype.hasClass = function(classNames) {
  if (classNames === '' || classNames === ' ') { return this; }
  var containsClass = false;
  var classes = classNames.split(/[,\s]+/g);
  for (var i=0,l=this.elems.length;i<l;i++) {
    for (var ii=0,ll=classes.length;ii<ll;ii++) {
      var regex = new RegExp(classes[ii]);
      if (regex.test(this.elems[i].className)) {
        containsClass = true;
      }
    }
  }
  return containsClass;
  //return this.elems[i].classList.contains(classNames.split(','));
};
//// HEIGHT
$Buoyant.prototype.height = function(height) {
  if (height) {
    for (var i=0,l=this.elems.length;i<l;i++) {
      this.elems[i].style.height = height;
    }
  } else {
    return this.elems[0].offsetHeight;
  }
  return this;
};
  //// HTML
  $Buoyant.prototype.html = function(html) {
    var result = '';
    if(html) {
      for (var i=0,l=this.elems.length;i<l;i++) {
        this.elems[i].innerHTML = html;
      }
      return this;
    } else {
      for (var i=0,l=this.elems.length;i<l;i++) {
        result += this.elems[i].text;
      }
      return result;
    }
  };
  //// LENGTH
  $Buoyant.prototype.length = function() {
    return this.elems.length;
  };
  //// NEXT
  $Buoyant.prototype.next = function() {
    var a = [];
    for (var i=0,l=this.elems.length;i<l;i++) {
      a[i] = this.elems[i].nextElementSibling;
    }
    return new $Buoyant(a);
  };
  // NODELIST TO ARRAY
  $Buoyant.prototype.nodeListToArray = function(selector) {
    var n = document.querySelectorAll(selector);
    var a = [];
    for (var i=0,l=n.length;i<l;i++) {
      a[i] = n[i];
    }
    return a;
  };
  //// OFF
  $Buoyant.prototype.off = function(event, targetOrFunc, func) {
    var that = this;
    // Delegate lister function
    if (func) {
      /*
      * Don't need the following commented out stuff because it's identical for every possible event delegated event,
      * only the callbacks are different; however, we need to still use the correct reference to successfully remove
      * the listerner w/ it's function
      */

      // Stringify function for comparison prep
      // var callback = String(function(e) {
      //   var delegatedElems = that.nodeListToArray(that.selector + ' ' + targetOrFunc);
      //   for (var i=0,l=delegatedElems.length;i<l;i++) {
      //     if (e.target === delegatedElems[i]) {
      //       func.call(delegatedElems[i],e);
      //     } else {
      //       var pe = e.target.parentElement;
      //       while (pe && delegatedElems[i] !== pe) {
      //         pe = pe.parentElement;
      //       }
      //       if (pe) {
      //         func.call(delegatedElems[i],e);
      //       }
      //     }
      //   }
      // });
var callbackFunc = String(func).replace(/\s/g,'');
      // Find matched function in delegation array
      for (var i=0,l=$.listenerCallbacksDelegatedFunctions.length;i<l;i++) {
        if (String($.listenerCallbacksDelegatedFunctions[i]).replace(/\s/g,'') === callbackFunc) {
          // Remove the attached listeners
          for (var ii=0,ll=this.elems.length;ii<ll;ii++) {
            this.elems[ii].removeEventListener(event, $.listenerCallbacksDelegated[i], false);
          }
          // Remove element from the global array
          $.listenerCallbacksDelegated.splice(i,1);
          $.listenerCallbacksDelegatedFunctions.splice(i,1);
          break;
        }
      }
    } else {
      // Remove event listener
      var callback = String(targetOrFunc);
      for (var i=0,l=$.listenerCallbacks.length;i<l;i++) {
        if (String($.listenerCallbacks[i]) === callback) {
          // Remove the attached listeners
          for (var ii=0,ll=this.elems.length;ii<ll;ii++) {
            this.elems[ii].removeEventListener(event, $.listenerCallbacks[i], false);
          }
          $.listenerCallbacks.splice(i,1);
          break;
        }
      }
    }
  };
  //// ON
  $Buoyant.prototype.on = function(event, targetOrFunc, func) {
    var that = this;
    // Delegate lister function
    if (func) {
      // Push function and callback function to array for global access to remove it later with "off"
      $.listenerCallbacksDelegatedFunctions.push(func);
      $.listenerCallbacksDelegated.push(function(e) {
        var delegatedElems = that.nodeListToArray(that.selector + ' ' + targetOrFunc);
        for (var i=0,l=delegatedElems.length;i<l;i++) {
          if (e.target === delegatedElems[i]) {
            func.call(delegatedElems[i],e);
          } else {
            var pe = e.target.parentElement;
            while (pe && delegatedElems[i] !== pe) {
              pe = pe.parentElement;
            }
            if (pe) {
              func.call(delegatedElems[i],e);
            }
          }
        }
      });
      for (var i=0,l=this.elems.length;i<l;i++) {
        this.elems[i].addEventListener(event, $.listenerCallbacksDelegated[$.listenerCallbacksDelegated.length - 1], false);
      }
    } else {
      // Push function to array for global access to remove it later with "off"
      $.listenerCallbacks.push(targetOrFunc);
      // Attach event listener
      for (var i=0,l=this.elems.length;i<l;i++) {
        this.elems[i].addEventListener(event, $.listenerCallbacks[$.listenerCallbacks.length - 1], false);
      }
    }
  };
  //// PARENT
  $Buoyant.prototype.parent = function() {
    var a = [];
    for (var i=0,l=this.elems.length;i<l;i++) {
      a[i] = this.elems[i].parentElement;
    }
    return new $Buoyant(a);
  };
  //// PREVIOUS
  $Buoyant.prototype.prev = function() {
    var a = [];
    for (var i=0,l=this.elems.length;i<l;i++) {
      a[i] = this.elems[i].previousElementSibling;
    }
    return new $Buoyant(a);
  };
  //// REMOVE/DELETE ELEMENT
  $Buoyant.prototype.remove = function() {
    for (var i=0,l=this.elems.length;i<l;i++) {
      this.elems[i].parentElement.removeChild(this.elems[i]);
    }
    return this;
  };
  //// REMOVE ATTRIBUTE
  $Buoyant.prototype.removeAttr = function(attr) {
    for (var i=0,l=this.elems.length;i<l;i++) {
      this.elems[i].removeAttribute(attr);
    }
    return this;
  };
  //// REMOVE CLASS
  $Buoyant.prototype.removeClass = function(classNames) {
    if (classNames === '' || classNames === ' ') {
      return this;
    } else {
      var classes = classNames.split(/[,\s]+/g);
      for (var i=0,l=this.elems.length;i<l;i++) {
        for (var ii=0,ll=classes.length;ii<ll;ii++) {
          if (new RegExp('^' + classes[ii] + '$').test(this.elems[i].className)) {
            this.elems[i].className = '';
          } else if (new RegExp('^' + classes[ii] + '\\s').test(this.elems[i].className)) {
            var re = new RegExp(classes[ii] + '\\s');
            this.elems[i].className = this.elems[i].className.replace(re,'');
          } else if (new RegExp('\\s' + classes[ii] + '$').test(this.elems[i].className) || new RegExp('\\s' + classes[ii] + '\\s').test(this.elems[i].className)) {
            var re = new RegExp('\\s' + classes[ii]);
            this.elems[i].className = this.elems[i].className.replace(re,'');
          }
        }
      }
    }
    return this;
  };
  //// SELECTED INDEX
  $Buoyant.prototype.selectedIndex = function() {
    var result = 0;
    for (var i=0,l=this.elems.length;i<l;i++) {
      result += this.elems[i].selectedIndex;
    }
    return result;
  };
  //// SIBLINGS
  $Buoyant.prototype.siblings = function() {
    var a = [],
    index = 0;
    for (var i=0,l=this.elems.length;i<l;i++) {
      var nl = this.elems[i].parentElement.children;
      for (var j = 0, m = nl.length; j < m; j++) {
        if(nl[j] !== this.elems[i]) {
          a[j - index] = nl[j];
        } else {
          // So skipping over this index doesn't create an "undefined" spot, or skip an index with Array.splice
          index++;
        }
      }
    }
    return new $Buoyant(a);
  };
  //// TEXT
  $Buoyant.prototype.text = function(text) {
    var result = '';
    if(text || text === 0 || text === '') {
      for (var i=0,l=this.elems.length;i<l;i++) {
        this.elems[i].textContent = text;
      }
      return this;
    } else {
      for (var i=0,l=this.elems.length;i<l;i++) {
        result += this.elems[i].textContent;
      }
      return result;
    }
  };
 //// TOGGLE CLASS
 $Buoyant.prototype.toggleClass = function(classNames) {
  var classes = classNames.split(/[,\s]+/g);
  for (var i=0,l=this.elems.length;i<l;i++) {
    for (var ii=0,ll=classes.length;ii<ll;ii++) {
      var regex = new RegExp('\\s*' + classes[ii],'g');
      if (regex.test(this.elems[i].className)) {
        this.elems[i].className = this.elems[i].className.replace(regex,'');
      } else {
        this.elems[i].className += ' ' + classes[ii];
      }
    }
  }
  // this.elems[i].classList.toggle(classes);
  return this;
};
  //// UNWRAP
  $Buoyant.prototype.unwrap = function(selector) {
    var wrappers = this.nodeListToArray(selector);
    for (var i=0,l=this.elems.length;i<l;i++) {
      var ancestor = this.elems[i];
      do {
        ancestor = ancestor.parentElement;
      } while (ancestor !== wrappers[i]);
      var docFrag = document.createDocumentFragment();
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.elems[i].outerHTML;
      var tempNodes = tempDiv.childNodes;
      var tempNodesArray = [];
      for (var ii=0,ll=tempNodes.length;ii<ll;ii++) {
        tempNodesArray[ii] = tempDiv.childNodes[ii];
      }
      for (var ii=0,ll=tempNodesArray.length;ii<ll;ii++) {
        docFrag.appendChild(tempNodesArray[ii]);
      }
      var parentOfParents = ancestor.parentElement;
      parentOfParents.insertBefore(docFrag, ancestor);
      parentOfParents.removeChild(ancestor);
    }
    return this;
  };
  //// VAL
  $Buoyant.prototype.val = function(value) {
    var result = '';
    if (value || value === 0 || value === '') {
      for (var i=0,l=this.elems.length;i<l;i++) {
        this.elems[i].value = value;
      }
      return this;
    } else {
      for (var i=0,l=this.elems.length;i<l;i++) {
        result += this.elems[i].text || this.elems[i].value;
      }
      return result;
    }
  };
  //// WIDTH
  $Buoyant.prototype.width = function(width) {
    if (width) {
      for (var i=0,l=this.elems.length;i<l;i++) {
        this.elems[i].style.width = width;
      }
    } else {
      return this.elems[0].offsetWidth;
    }
    return this;
  };
  //// WRAP
  $Buoyant.prototype.wrap = function(opening, closing) {
    for (var i=0,l=this.elems.length;i<l;i++) {
      var docFrag = document.createDocumentFragment();
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = opening + this.elems[i].outerHTML + closing;
      var tempNodes = tempDiv.childNodes;
      var tempNodesArray = [];
      for (var ii=0,ll=tempNodes.length;ii<ll;ii++) {
        tempNodesArray[ii] = tempDiv.childNodes[ii];
      }
      for (var ii=0,ll=tempNodesArray.length;ii<ll;ii++) {
        docFrag.appendChild(tempNodesArray[ii]);
      }
      var parent = this.elems[i].parentElement;
      parent.insertBefore(docFrag, this.elems[i]);
      parent.removeChild(this.elems[i]);
    }
    return this;
  };


// END PROTOTYPE METHODS








// $Buoyant OBJECT CREATOR
// Use CSS3 selector syntax but CSS 2.1 selector syntax for < IE9
var $ = function(s) {
  var a = [];
  if (!s) {
    // Return for instant use, such as the ajax function
    return this;
  } else if (typeof s === 'object') {
    // for each element, window, or document
    a[0] = s;
    return new $Buoyant(a,s);
  } else if (typeof s === 'function') {
    // On load shorthand $(function() {});
    document.addEventListener("DOMContentLoaded", s);
  } else {
    // Selector string
    // If string isn't found don't return false; otherwise, properties of unaccessible elements will fail
    var n=document.querySelectorAll(s),l=n.length,i=0;
    for(;i<l;i++){a[i]=n[i];}
      return new $Buoyant(a,s);
  }
};












//// AJAX
$.ajax = function(ajax) {

  // CREATE REQUEST AND SETUP CALLBACKS
  var http = new XMLHttpRequest();

  if (!http) {
    if (ajax.hasOwnProperty('error')) {
     ajax.error('Could not establish HTTP request.');
   }
   return false;
 } else {
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      var httpResponse = http.responseText;
      if (ajax.dataType === 'json') {
        httpResponse = JSON.parse(httpResponse);
      }
      if (http.status === 200) {
         // Success
         if (ajax.hasOwnProperty('success')) {
          ajax.success(httpResponse);
        }
      } else {
        // Error
        if (ajax.hasOwnProperty('error')) {
          ajax.error(httpResponse);
        }
      }
     // Finally
     if (ajax.hasOwnProperty('finally')) {
      ajax.finally(httpResponse);
    }
  } else {
    // It trys as much as 4 times in a row
  }
};

// OPEN ACTION/URL
var method = (function() {
  if (ajax.hasOwnProperty('method')) {
    return ajax.method.toUpperCase();
  } else if (ajax.hasOwnProperty('type')) {
    return ajax.type.toUpperCase();
  } else {
    return 'POST';
  }
})();
var action = (function() {
  if (ajax.hasOwnProperty('action')) {
    return ajax.action;
  } else {
    return ajax.url;
  }
})();
http.open(method, action);

// SET CONTENT TYPE
if (ajax.hasOwnProperty('dataType')) {
  ajax.dataType = ajax.dataType.toLowerCase();
  switch (ajax.dataType) {
    case 'html':
    http.setRequestHeader("Content-Type", "text/html;charset=UTF-8");
    break;
    case 'json':
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (ajax.hasOwnProperty('data')) { ajax.data = JSON.stringify(ajax.data); }
    break;
    case 'script':
    http.setRequestHeader("Content-Type", "application/javascript;charset=UTF-8");
    break;
    case 'xml':
    http.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
    break;
    default:
    http.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  }
} else {
  // Default, send as text
  http.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
}

// SEND THE AJAX CALL TO THE SERVER!
if (ajax.hasOwnProperty('data')) {
  http.send(ajax.data);      
} else {
  http.send();      
}
}

  }; // end AJAX



//// LISTENER CALLBACKS (GLOBAL)
$.listenerCallbacks = [];
$.listenerCallbacksDelegated = [];
$.listenerCallbacksDelegatedFunctions = [];
