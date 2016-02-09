/*
 BuoyantJS v1.4.0
 (c) 2013-2015 by Depth Development. http://depthdev.com
 License: MIT
*/


'use strict';


//////////////////////////////////////
//
//  $$Buoyant Framework
//
//////////////////////////////////////
// $$Buoyant Global Object
var $$Buoyant = function(options) {

  // Prefix
  this.prefix = 'by';
  // Offline (Support offline for this app?)
  this.offlineSupport = false;
  // Offline Status
  this.offline = false;

  // OPTIONS
  if (options) {
    this.prefix = options.hasOwnProperty('prefix') ? options.prefix : 'by';
    this.offlineSupport = options.hasOwnProperty('offlineSupport') ? options.offlineSupport : false;
    this.offline = options.hasOwnProperty('offline') ? options.offline : false;
  }

  // BUOYANT STYLES
  (function() {
    var style = document.createElement('style');
    style.textContent = '[' + this.prefix + '-cloak], [' + this.prefix + '-ready] { display: none !important; }';
    document.querySelector('head').appendChild(style);
  }.bind(this));

  // DEVELOPER'S VIEW
  this.viewSelector = document.querySelector('[' + this.prefix + '-view]');

}; // end $$Buoyant




// NODELIST TO ARRAY
$$Buoyant.prototype.parseNodeList = function(s) { var a = [], nl = document.querySelectorAll(s); for (var i = 0, l = nl.length; i < l; i++) { a[i] = nl[i]; } return a; };




// TRIM
//$$Buoyant.prototype.trim = function(s) { return s.replace(/^\s+|\s+$/g,''); };




// TRIM FUNCTION STRING FROM MARKUP
$$Buoyant.prototype.parseListener = function(s) { return s.replace(/(\s|\(|\))/g,''); };




// RESET (Unbinds and binds everything anew including by-fors)
$$Buoyant.prototype.reset = function() {
  this.controllerUnbind(this.controllerName);
  if (this.resources[this.controllerName].hasOwnProperty('view')) {
    if (this.resources[this.controllerName].hasOwnProperty('styles')) {
      this.viewSelector.innerHTML = '<style>' + this.resources[this.controllerName].styles + '</style>';
      var docFrag = document.createDocumentFragment();
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.resources[this.controllerName].view;
      docFrag.appendChild(tempDiv.childNodes[0]);
      this.viewSelector.appendChild(docFrag);
    } else {
      this.viewSelector.innerHTML = this.resources[this.controllerName].view;
    }
  } else {
    // This is a static controller and outside the by-view container
  }
  this.controllerBind(this.controllerName);
};




// HTTP ASYNCHRONOUS CALLS
$$Buoyant.prototype.http = function(ajax) {

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
}; // end http




// TWO-WAY BINDING FUNCTIONS
// BIND DEVELOPER'S $$/SCOPE PROPERTIES TO MARKUP
$$Buoyant.prototype.bindFromDev = function(controller) {

  // Bind bindings
  var b = this.parseNodeList('[' + this.prefix + '-controller="' + controller + '"] [' + this.prefix + '-bind]');
  for (var i = 0, l = b.length; i < l; i++) {
    if (/(INPUT|TEXTAREA|PROGRESS)/i.test(b[i].nodeName)) {
      b[i].value = this.$$[controller][b[i].getAttribute(this.prefix + '-bind')];
    } else {
      b[i].textContent = this.$$[controller][b[i].getAttribute(this.prefix + '-bind')];
    }
  }
}; // end bindFromDev

// BIND USER'S VALUES TO $$/SCOPE PROPERTIES
$$Buoyant.prototype.bindFromUser = function(controller, elem) {
  if (/(INPUT|TEXTAREA|PROGRESS)/i.test(elem.nodeName)) {
    this.$$[controller][elem.getAttribute(this.prefix + '-bind')] = elem.value;
  } else {
    this.$$[controller][elem.getAttribute(this.prefix + '-bind')] = elem.textContent;
  }
}; // end bindFromUser




// DEVELOPER'S RESOURCES OBJECT
$$Buoyant.prototype.resources = {};



// DEVELOPER'S ROUTE OBJECT
// This holds the url as a property name with the value of the controller name
$$Buoyant.prototype.route = {};




// ROUTER (Load controller's view and model)
$$Buoyant.prototype.router = function(controller, isStatic) {

  var that = this;

// Unbind last controller(s)
// Make sure the controller is nested inside "by-view", otherwise it may remove another controller outside of it
if (this.controllerName) {
  if (this.$$.hasOwnProperty(this.controllerName)) {
    this.controllerUnbind(this.controllerName);
  }
}

// Set current controller's name
if (!isStatic) {
  this.controllerName = controller;
}

// Make sure controller exists for this url
if (this.resources.hasOwnProperty(controller)) {
  // Remove new controller's old object
  delete this.$$[controller];
  // Add it back
  this.$$[controller] = {};
  // Inject new controller's view
  if (!isStatic) {
    if (this.resources[controller].hasOwnProperty('styles')) {
      this.viewSelector.innerHTML = '<style>' + this.resources[controller].styles + '</style>';
      var docFrag = document.createDocumentFragment();
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.resources[controller].view;
      docFrag.appendChild(tempDiv.childNodes[0]);
      this.viewSelector.appendChild(docFrag);
    } else {
      this.viewSelector.innerHTML = this.resources[controller].view;
    }
  }
  // Run controller's model/script
  setTimeout(function() {
    that.controllerBind(controller, that.resources[controller].model);
  }, 10);
}

}; // end router




// ROUTE INIT (Run current view)
$$Buoyant.prototype.routeInit = function() {

  var that = this;

  // Make sure model has loaded before running
  var check = function(path) {
    if (that.route.hasOwnProperty(path)) {
      that.router(that.route[path]);
    } else {
      setTimeout(function() {
        check(path);
      }, 100);
    }
  };

  // Get current location
  var hash = location.hash;
  if (!/#\!\//.test(window.location.href.toString()) && hash) {
    // This is a inner page hyperlink, so don't navigate
  } else if (/#\!\//.test(hash)) {
    var parsedHash = hash.replace(/#\!/,'').replace(/\/$/,'');
    history.replaceState('','',parsedHash);
    // Load controller's view and model
    check(parsedHash);
  } else {
    // Check if root of domain, or a hashless hash
    check(location.pathname);
  }

}; // end routeInit()



// CURRENT CONTROLLER NAME
$$Buoyant.prototype.controllerName = undefined;




// RUN CONTROLLER SCRIPTS
$$Buoyant.prototype.controller = function(controller, script) {
  // If a 100% routed application, load in the script because the controller property was already added by the $$routes function;
  // otherwise, create the object, set the script, then run it
  if (this.resources.hasOwnProperty(controller)) {
    this.resources[controller].model = script;
  } else {
    this.resources[controller] = {};
    this.resources[controller].model = script;
    this.router(controller, true);
  }
}; // end controller




// UNBIND DEVELOPER'S CONTROLLER
$$Buoyant.prototype.controllerUnbind = function(controller) {

  /*
  * I don't think I need this because view gets replaced,
  * so unless there are pointers to the elements,
  * the listeners will get removed from the JavaScript's garbage collection
  */

  // var that = this;

  // // Click bindings
  // var clicks = this.parseNodeList('[' + this.prefix + '-controller="' + controller + '"] [' + this.prefix + '-click]');
  // for (var i = 0, l = clicks.length; i < l; i++) {
  //   clicks[i].removeEventListener('click', function() {
  //     that.$$[controller][that.parseListener(this.getAttribute(that.prefix + '-click'))].call(this);
  //   }, false);
  // }
  // // Keyup bindings
  // var keyups = this.parseNodeList('[' + this.prefix + '-controller="' + controller + '"] [' + this.prefix + '-keyup]');
  // for (var i = 0, l = keyups.length; i < l; i++) {
  //   keyups[i].removeEventListener('keyup', function() {
  //     that.$$[controller][that.parseListener(this.getAttribute(that.prefix + '-keyup'))].call(this);
  //   }, false);
  // }
  // // Change bindings
  // var changes = this.parseNodeList('[' + this.prefix + '-controller="' + controller + '"] [' + this.prefix + '-change]');
  // for (var i = 0, l = changes.length; i < l; i++) {
  //   changes[i].removeEventListener('change', function() {
  //     that.$$[controller][that.parseListener(this.getAttribute(that.prefix + '-change'))].call(this);
  //   }, false);
  // }
  // // Remove 2nd end of two-way bindings
  // var parentListener = document.querySelector('[' + this.prefix + '-controller="' + controller + '"]');
  // parentListener.removeEventListener('click', function() { that.bindFromUser(controller, event.target); });
  // parentListener.removeEventListener('keyup', function() { that.bindFromUser(controller, event.target); });
  // parentListener.removeEventListener('change', function() { that.bindFromUser(controller, event.target); });

}; // end controllerUnbind




// BIND DEVELOPER'S CONTROLLER
$$Buoyant.prototype.controllerBind = function(controller, model) {

  try {

    var that = this;

// Attach 2nd end of two-way binding to parent and bind values from the User to the developer's $$/scope object
var parentListener = document.querySelector('[' + this.prefix + '-controller="' + controller + '"]');
parentListener.addEventListener('click', function() { that.bindFromUser(controller, event.target); });
parentListener.addEventListener('keyup', function() { that.bindFromUser(controller, event.target); });
parentListener.addEventListener('change', function() { that.bindFromUser(controller, event.target); });

// RUN DEVELOPER'S CONTROLLER CODE
if (model) {
  model(this.$$[controller], this.http.bind(this));
} else {
  // reset was called from developer's http request, so don't cause an infinite loop by running it over and over again
}

// BUILD "FOR" (EACH/REPEAT) MARKUP
var fors = this.parseNodeList('[' + this.prefix + '-controller="' + controller + '"] [' + this.prefix + '-for]');
for (var i = 0, l = fors.length; i < l; i++) {
  // Get element and children as a string
  var htmlStr = fors[i].outerHTML;
  // Grab the string that contains the key and obj names
  var tempRegex = new RegExp('.*' + this.prefix + '\\-for\\="\\s*(\\w+)\\s+in\\s+(\\w+)[.\\s\\S]+');
  var keyAndObj = htmlStr.replace(tempRegex,'$1BuoyantJS$2');
  // Remove attributes
  tempRegex = new RegExp('\\s+' + this.prefix + '\\-cloak\\=?("{2})?','g');
  htmlStr = htmlStr.replace(tempRegex,''); // remove cloaks
  //htmlStr = htmlStr.replace(/\s*by-for\=".+\"/,''); // remove by-for="[? in ?]"
  // Extract just the key token
  var key = keyAndObj.replace(/(\w+)BuoyantJS.+/,'$1');
  // Extract just the obj name
  var obj = keyAndObj.replace(/\w+BuoyantJS(\w+)/,'$1');
  // Get length of developer's array so we can repeat the nessesary amount of times
  var devArrayLength = this.$$[controller][obj].length;
  // Create Regex to match all key-value pairs in html
  var regexToMatch = new RegExp('\{\{\\s*' + key + '\\.\\w+\\s*\}\}','g');
  // Create an array of key-value pair bindings
  var matches = htmlStr.match(regexToMatch);
  // Create an empty array to store the property names from the value of each key instance
  var props = [];
  // Strip out all but the property names and push them to the matches array
  for (var ii = 0, ll = matches.length; ii < ll; ii++) {
    props[ii] = matches[ii].replace(/\{\{\s*\w+\.(\w+)\s*\}\}/,'$1');
  }
  // Find each key-value pair again and replace it with the value of the developer's pre-defined array object's values then push the whole str to the new variable
  var newHtmlStrCollection = '';
  var newHtmlStr = '';
  for (var ii = 0, ll = devArrayLength; ii < ll; ii++) {
    newHtmlStr = htmlStr;
    for (var iii = 0, lll = matches.length; iii < lll; iii++) {
      var re = new RegExp(matches[iii]);
      newHtmlStr = newHtmlStr.replace(re, this.$$[controller][obj][ii][props[iii]]);
    }
    newHtmlStrCollection += newHtmlStr;
  }
  // To avoid a simple solution of innerHTML where all siblings would be removed, and to avoid injecting a wrapping element; we create a temporary fragment element, convert the html string
  // to HTML, get the child nodes, convert them to an array, append each element to the fragment, then inject it and remove the template copy.
  var parent = fors[i].parentNode;
  var docFrag = document.createDocumentFragment();
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = newHtmlStrCollection;
  var tempNodes = tempDiv.childNodes;
  var tempNodesArray = [];
  for (var ii = 0, ll = tempNodes.length; ii < ll; ii++) {
    tempNodesArray[ii] = tempDiv.childNodes[ii];
  }
  for (var ii = 0, ll = tempNodesArray.length; ii < ll; ii++) {
    docFrag.appendChild(tempNodesArray[ii]);
  }
  parent.insertBefore(docFrag, fors[i]);
  parent.removeChild(fors[i]);
}

// RUN DEVELOPER'S $$ BINDINGS
this.bindFromDev(controller);

// BIND DEVELOPER'S LISTENERS
// Click bindings
var clicks = this.parseNodeList('[' + this.prefix + '-controller="' + controller + '"] [' + this.prefix + '-click]');
for (var i = 0, l = clicks.length; i < l; i++) {
  clicks[i].addEventListener('click', function() {
    that.$$[controller][that.parseListener(this.getAttribute(that.prefix + '-click'))].call(this);
  }, false);
}
// Keyup bindings
var keyups = this.parseNodeList('[' + this.prefix + '-controller="' + controller + '"] [' + this.prefix + '-keyup]');
for (var i = 0, l = keyups.length; i < l; i++) {
  keyups[i].addEventListener('keyup', function() {
    that.$$[controller][that.parseListener(this.getAttribute(that.prefix + '-keyup'))].call(this);
  }, false);
}
// Change bindings
var changes = this.parseNodeList('[' + this.prefix + '-controller="' + controller + '"] [' + this.prefix + '-change]');
for (var i = 0, l = changes.length; i < l; i++) {
  changes[i].addEventListener('change', function() {
    that.$$[controller][that.parseListener(this.getAttribute(that.prefix + '-change'))].call(this);
  }, false);
}

} catch(e) {
  console.log('BuoyantJS resource(s) are missing; or, names do not match across all associations for the "' + controller + '" controller.');
}

}; // end controllerBind








//////////////////////
// DEVELOPER METHODS
//////////////////////


// DEVELOPER'S $$/SCOPE OBJECT
$$Buoyant.prototype.$$ = {};

// DEVELOPER'S MANUAL RESET
$$Buoyant.prototype.$$reset = function() {
  this.reset();
};

// HTTP FOR DEVELOPER'S ASYNCHRONOUS CALLS
$$Buoyant.prototype.$$http = function(ajax) {

  var that = this;

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
     // Unbind and re-bind everything for developer
     that.reset();
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
}; // end $$http




// SETUP VIEWS FOR ROUTES
$$Buoyant.prototype.$$routes = function(routes) {


  var that = this;



  // If offline, rebuild the route and resources objects with stored routes, views and styles, otherwise; create the route and resources objects
  if (this.offline && localStorage.hasOwnProperty('BuoyantJS_resources')) {
    this.route = JSON.parse(localStorage.getItem('BuoyantJS_route'));
    this.resources = JSON.parse(localStorage.getItem('BuoyantJS_resources'));
  } else {
    // Create properites for the developer's controllers so we can add the view and scripts to it.
    // This runs before the controller method because the controller method adds the model property immediately after.
    for (var i = 0, l = routes.length;i<l;i++) {
      // Add the url string as a first-level property of the route object and assign the controller associated with that
      this.route[routes[i].url] = routes[i].controller;
      // Add the controller name as a first-level property of the resources object
      this.resources[routes[i].controller] = {};
    }
  }



  // Add listener for hash and used-to-be hash changes to route the view automatically
  if (/Edge|Trident|MSIE/.test(navigator.userAgent)) {
    addEventListener('hashchange', function(e) {
      e.preventDefault();
      that.routeInit();
    });
  } else {
    addEventListener('popstate', function(e) {
      e.preventDefault();
      that.routeInit();
    });
  }


  // Get the current location to know what view to populate below
  var href = window.location.href.toString();
  var path = /\/#\!/.test(href) ? href.replace(/https?:\/\/.+\/#\!/,'').replace(/\/$/,'') : '/';




  var launchApp = function() {

      // Load view
      that.routeInit();

      // Show elements that were hidden with "by-ready"
      var byReady = that.parseNodeList('[' + that.prefix + '-ready]');
      for (var ii=0,ll=byReady.length;ii<ll;ii++) {
        byReady[ii].removeAttribute(that.prefix + '-ready');
      }

      // Run the $$ready function in case developer has code depending on that callback
      that.$$ready();

    };


  // IF OFFLINE, LAUNCH THE APP, OTHERWISE, AJAX THE VIEWS AND STYLES
  if (that.offline) {
    launchApp();
  }  else {


  // CHECK IF READY TO INITIALIZE
  var checkIfReady = function() {
    if (totalViewsAndStyles === actualLoadedViews + actualLoadedStyles) {

      // Store route object and resources in session storage for offline use or on an as-needed basis if applicable
      if (that.offlineSupport) {
        localStorage.setItem('BuoyantJS_route', JSON.stringify(that.route));
        // The models get stripped out, but that's what I want because converting a string script back into code could be a door for local storage attacks
        localStorage.setItem('BuoyantJS_resources', JSON.stringify(that.resources));
      }

      // Start the app!
      launchApp();
    }
  };

  // AJAX COUNT
  var totalViewsAndStyles = (function() {
    var count = routes.length;
    for (var i = 0, l = routes.length; i < l; i++) {
      if (routes[i].hasOwnProperty('styles')) {
        if (Array.isArray(routes[i].styles)) {
          count+= routes[i].styles.length;
        } else {
          count++;
        }
      }
    }
    return count;
  })();


  // GET ALL HTML FILES
  // Add each view to the controller on the resources object
  var actualLoadedViews = 0;
  var loadViews = function(index) {
    that.http({
      action: routes[index].view,
      method: 'GET',
      dataType: 'HTML',
      success: function(data) {
        // Set controller view to resources object
        that.resources[routes[index].controller].view = data;
      },
      error: function(data) {
        console.log('No view found for controller: ' + routes[index].controller + '.');
      },
      finally: function(data) {
        actualLoadedViews++;
        checkIfReady();
      }
    }); // end http
  };

  for (var i = 0; i < routes.length; i++) {
    loadViews(i);
  } // end for loop


  // GET ALL CSS FILES
  // Add each view's style to the controller on the resources object
  var actualLoadedStyles = 0;
  var loadStyles = function(index, elemIndex) {
    that.http({
      action: elemIndex || elemIndex === 0 ? routes[index].styles[elemIndex] : routes[index].styles,
      method: 'GET',
      dataType: 'text',
      success: function(data) {
        // Set controller style to resources object
        var path = that.resources[routes[index].controller];
        // Prevent creating "undefined" at the beginning of the styles
        if (path.styles) {
          path.styles += data;
        } else {
          path.styles = '' + data;
        }
      },
      error: function(data) {
        console.log('No style(s) found for controller: ' + routes[index].controller + '.');
      },
      finally: function(data) {
        actualLoadedStyles++;
        checkIfReady();
      }
    }); // end http
  };

  for (var i = 0; i < routes.length; i++) {
    if (routes[i].hasOwnProperty('styles')) {
      if (Array.isArray(routes[i].styles)) {
        for (var ii = 0, ll = routes[i].styles.length; ii < ll; ii++) {
          loadStyles(i, ii);
        }
      } else {
        loadStyles(i);
      }
    }
  } // end for loop
} // end not offline


}; // end $$routes




// READY
$$Buoyant.prototype.$$ready = function() {};















// CREATE GLOBAL INSTANCE OF BUOYANTJS FOR DEVELOPER'S CONSUMPTION
var buoyant = new $$Buoyant();
