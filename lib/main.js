import NodeCollection from "./node_collection.js";

const queue = [];

window.$m = function (arg) {

  if (arg instanceof HTMLElement) {
    const tag = [arg];
    return new NodeCollection(tag);
  } else if ((typeof arg) === "string") {
    const HTMLElements = Array.from(document.querySelectorAll(arg));
    return new NodeCollection(HTMLElements);
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
