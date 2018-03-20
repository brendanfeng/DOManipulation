/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_collection_js__ = __webpack_require__(1);


const queue = [];

window.$m = function (arg) {

  if (arg instanceof HTMLElement) {
    const tag = [arg];
    return new __WEBPACK_IMPORTED_MODULE_0__node_collection_js__["a" /* default */](tag);
  } else if ((typeof arg) === "string") {
    const HTMLElements = Array.from(document.querySelectorAll(arg));
    return new __WEBPACK_IMPORTED_MODULE_0__node_collection_js__["a" /* default */](HTMLElements);
  } else if (arg instanceof Function) {
    queue.push(arg);
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        queue.forEach( (func) => {
          func();
          queue.shift();
        });
      }
    };
  }
};

$m.extend = function (rootObj, ...otherObjs) {
  otherObjs.forEach((obj) => {
    for (const prop in obj) {
      rootObj[prop] = obj[prop];
    }
  });
  return rootObj;
};

$m.ajax = (options) => {
  const xhr = new XMLHttpRequest();
  const defaults = {
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    url: window.location.href,
    data: {},
    success: () => {},
    error: () => {}
  };
  const ajaxData = $m.extend({}, defaults, options);
  ajaxData.method = ajaxData.method.toUpperCase();

  return new Promise((resolve, reject) => {
    xhr.open(ajaxData.method, ajaxData.url);
    xhr.onload = (e) => {
      if (xhr.status === 200) {
        resolve(xhr.response);
        ajaxData.success(xhr.response);
      } else {
        reject(xhr.response);
        ajaxData.error(xhr.response);
      }
    };

    xhr.send(JSON.stringify(ajaxData.data));
  });
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class NodeCollection {
  constructor(HTMLElements) {
    this.HTMLElements = HTMLElements;
  }

  html (string = null) {
    if (string instanceof String) {
      this.HTMLElements.forEach ( function (el) {
        el.innerHTML = string;
      });
    } else if (string === null){
      return this.HTMLElements[0].innerHTML;
    }
  }

  empty () {
    this.html("");
  }

  append (content) {
    if (content instanceof HTMLElement) {
      this.HTMLElements.forEach ( (el) => {
        el.innerHTML += content.outerHTML;
      });
    }else if (content instanceof NodeCollection) {
      this.HTMLElements.forEach ( (el) => {
        for (var i = 0; i < content.HTMLElements.length; i++) {
          el.innerHTML += content.HTMLElements[i];
        }
      });
    }else if ((typeof content) === "string") {
      this.HTMLElements.forEach ( (el) => {
        el.innerHTML += content;
      });
    }
  }

  attr (attrName, value = null ) {
    if (value === null) {
      let result = [];
      return this.HTMLElements[0].getAttribute(attrName);
    } else {
        this.HTMLElements.forEach ( (el) => {
          el.setAttribute(name, value);
        });
    }
  }

  addClass (name) {
    this.HTMLElements.forEach( (el) => {
      el.classList.add(name);
    });
  }

  removeClass (name) {
    if (name) {
      this.HTMLElements.forEach( (el) => {
        el.classList.remove(name);
      });
    } else {
      this.HTMLElements.forEach( (el) => {
        el.classname = null;
      });
    }
  }

  toggleClass (name) {
    this.HTMLElements.forEach( (el) => {
      el.classList.toggle(name);
    });
  }

  children () {
    const result = [];
    this.HTMLElements.forEach ( (parent) => {
      result.push(Array.from(parent.children));
    });
    return new NodeCollection(result);
  }

  parent () {
    const result = [];
    this.HTMLElements.forEach ( (child) => {
      result.push(Array.from(child.parentElement));
    });
    return new NodeCollection(result);
  }

  find (selector) {
    let result = [];
    this.HTMLElements.forEach( (el) => {
      result = result.concat(Array.from(el.querySelectorAll(selector)));
    });
    const query = new NodeCollection(result);
    return query;
  }

  remove () {
    this.HTMLElements.forEach( (el) => {
      el.remove();
    });
    this.HTMLElements = [];
  }

  on (e, func) {
    this.HTMLElements.forEach( (el) => {
      el.addEventListener(e, func);
      const eType = `event-${e}`;
      if (!el[eType]) {
        el.eType = [];
      }
      el.eType.push(func);
    });
  }

  off(e) {
    this.HTMLElements.forEach( (el) => {
      const eType = `event-${e}`;
      if (el[eType]) {
        el[eType].forEach((func) => {
          el.removeEventListener(e, func);
        });
      }
      el[eType] = [];
    });
  }


}
/* harmony export (immutable) */ __webpack_exports__["a"] = NodeCollection;



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map