export default class NodeCollection {
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
