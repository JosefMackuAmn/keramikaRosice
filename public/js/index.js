/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/fetch-polyfill/fetch.js":
/*!**********************************************!*\
  !*** ./node_modules/fetch-polyfill/fetch.js ***!
  \**********************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
/***/ (function() {

(function() {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = name.toString();
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    var self = this
    if (headers instanceof Headers) {
      headers.forEach(function(name, values) {
        values.forEach(function(value) {
          self.append(name, value)
        })
      })

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        self.append(name, headers[name])
      })
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  // Instead of iterable for now.
  Headers.prototype.forEach = function(callback) {
    var self = this
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      callback(name, self.map[name])
    })
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return fetch.Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new fetch.Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else {
        throw new Error('unsupported BodyInit type')
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return fetch.Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return fetch.Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return fetch.Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : fetch.Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(function (text) {
          return JSON.parse(text);
      });
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(url, options) {
    options = options || {}
    this.url = url

    this.credentials = options.credentials || 'omit'
    this.headers = new Headers(options.headers)
    this.method = normalizeMethod(options.method || 'GET')
    this.mode = options.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(options.body)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  function getXhr() {
    // from backbone.js 1.1.2
    // https://github.com/jashkenas/backbone/blob/1.1.2/backbone.js#L1181
    if (noXhrPatch && !(/^(get|post|head|put|delete|options)$/i.test(this.method))) {
      this.usingActiveXhr = true;
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
    return new XMLHttpRequest();
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this._initBody(bodyInit)
    this.type = 'default'
    this.url = null
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
  }

  Body.call(Response.prototype)

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    // TODO: Request constructor should accept input, init
    var request
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input
    } else {
      request = new Request(input, init)
    }

    return new fetch.Promise(function(resolve, reject) {
      var xhr = getXhr();
      if (request.credentials === 'cors') {
        xhr.withCredentials = true;
      }

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      function onload() {
        if (xhr.readyState !== 4) {
          return
        }
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }
      xhr.onreadystatechange = onload;
      if (!self.usingActiveXhr) {
        xhr.onload = onload;
        xhr.onerror = function() {
          reject(new TypeError('Network request failed'))
        }
      }

      xhr.open(request.method, request.url, true)

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(name, values) {
        values.forEach(function(value) {
          xhr.setRequestHeader(name, value)
        })
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  fetch.Promise = self.Promise; // you could change it to your favorite alternative
  self.fetch.polyfill = true
})();


/***/ }),

/***/ "./node_modules/url-search-params-polyfill/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/url-search-params-polyfill/index.js ***!
  \**********************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_require__.g, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/**
 *
 *
 * @author Jerry Bendy <jerry@icewingcc.com>
 * @licence MIT
 *
 */

(function(self) {
    'use strict';

    var nativeURLSearchParams = (function() {
            // #41 Fix issue in RN
            try {
                if (self.URLSearchParams && (new self.URLSearchParams('foo=bar')).get('foo') === 'bar') {
                    return self.URLSearchParams;
                }
            } catch (e) {}
            return null;
        })(),
        isSupportObjectConstructor = nativeURLSearchParams && (new nativeURLSearchParams({a: 1})).toString() === 'a=1',
        // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
        decodesPlusesCorrectly = nativeURLSearchParams && (new nativeURLSearchParams('s=%2B').get('s') === '+'),
        __URLSearchParams__ = "__URLSearchParams__",
        // Fix bug in Edge which cannot encode ' &' correctly
        encodesAmpersandsCorrectly = nativeURLSearchParams ? (function() {
            var ampersandTest = new nativeURLSearchParams();
            ampersandTest.append('s', ' &');
            return ampersandTest.toString() === 's=+%26';
        })() : true,
        prototype = URLSearchParamsPolyfill.prototype,
        iterable = !!(self.Symbol && self.Symbol.iterator);

    if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly && encodesAmpersandsCorrectly) {
        return;
    }


    /**
     * Make a URLSearchParams instance
     *
     * @param {object|string|URLSearchParams} search
     * @constructor
     */
    function URLSearchParamsPolyfill(search) {
        search = search || "";

        // support construct object with another URLSearchParams instance
        if (search instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) {
            search = search.toString();
        }
        this [__URLSearchParams__] = parseToDict(search);
    }


    /**
     * Appends a specified key/value pair as a new search parameter.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.append = function(name, value) {
        appendTo(this [__URLSearchParams__], name, value);
    };

    /**
     * Deletes the given search parameter, and its associated value,
     * from the list of all search parameters.
     *
     * @param {string} name
     */
    prototype['delete'] = function(name) {
        delete this [__URLSearchParams__] [name];
    };

    /**
     * Returns the first value associated to the given search parameter.
     *
     * @param {string} name
     * @returns {string|null}
     */
    prototype.get = function(name) {
        var dict = this [__URLSearchParams__];
        return this.has(name) ? dict[name][0] : null;
    };

    /**
     * Returns all the values association with a given search parameter.
     *
     * @param {string} name
     * @returns {Array}
     */
    prototype.getAll = function(name) {
        var dict = this [__URLSearchParams__];
        return this.has(name) ? dict [name].slice(0) : [];
    };

    /**
     * Returns a Boolean indicating if such a search parameter exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    prototype.has = function(name) {
        return hasOwnProperty(this [__URLSearchParams__], name);
    };

    /**
     * Sets the value associated to a given search parameter to
     * the given value. If there were several values, delete the
     * others.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.set = function set(name, value) {
        this [__URLSearchParams__][name] = ['' + value];
    };

    /**
     * Returns a string containg a query string suitable for use in a URL.
     *
     * @returns {string}
     */
    prototype.toString = function() {
        var dict = this[__URLSearchParams__], query = [], i, key, name, value;
        for (key in dict) {
            name = encode(key);
            for (i = 0, value = dict[key]; i < value.length; i++) {
                query.push(name + '=' + encode(value[i]));
            }
        }
        return query.join('&');
    };

    // There is a bug in Safari 10.1 and `Proxy`ing it is not enough.
    var forSureUsePolyfill = !decodesPlusesCorrectly;
    var useProxy = (!forSureUsePolyfill && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy);
    /*
     * Apply polifill to global object and append other prototype into it
     */
    Object.defineProperty(self, 'URLSearchParams', {
        value: (useProxy ?
            // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
            new Proxy(nativeURLSearchParams, {
                construct: function(target, args) {
                    return new target((new URLSearchParamsPolyfill(args[0]).toString()));
                }
            }) :
            URLSearchParamsPolyfill)
    });

    var USPProto = self.URLSearchParams.prototype;

    USPProto.polyfill = true;

    /**
     *
     * @param {function} callback
     * @param {object} thisArg
     */
    USPProto.forEach = USPProto.forEach || function(callback, thisArg) {
        var dict = parseToDict(this.toString());
        Object.getOwnPropertyNames(dict).forEach(function(name) {
            dict[name].forEach(function(value) {
                callback.call(thisArg, value, name, this);
            }, this);
        }, this);
    };

    /**
     * Sort all name-value pairs
     */
    USPProto.sort = USPProto.sort || function() {
        var dict = parseToDict(this.toString()), keys = [], k, i, j;
        for (k in dict) {
            keys.push(k);
        }
        keys.sort();

        for (i = 0; i < keys.length; i++) {
            this['delete'](keys[i]);
        }
        for (i = 0; i < keys.length; i++) {
            var key = keys[i], values = dict[key];
            for (j = 0; j < values.length; j++) {
                this.append(key, values[j]);
            }
        }
    };

    /**
     * Returns an iterator allowing to go through all keys of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.keys = USPProto.keys || function() {
        var items = [];
        this.forEach(function(item, name) {
            items.push(name);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all values of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.values = USPProto.values || function() {
        var items = [];
        this.forEach(function(item) {
            items.push(item);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all key/value
     * pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.entries = USPProto.entries || function() {
        var items = [];
        this.forEach(function(item, name) {
            items.push([name, item]);
        });
        return makeIterator(items);
    };


    if (iterable) {
        USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries;
    }


    function encode(str) {
        var replace = {
            '!': '%21',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '~': '%7E',
            '%20': '+',
            '%00': '\x00'
        };
        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
            return replace[match];
        });
    }

    function decode(str) {
        return str
            .replace(/[ +]/g, '%20')
            .replace(/(%[a-f0-9]{2})+/ig, function(match) {
                return decodeURIComponent(match);
            });
    }

    function makeIterator(arr) {
        var iterator = {
            next: function() {
                var value = arr.shift();
                return {done: value === undefined, value: value};
            }
        };

        if (iterable) {
            iterator[self.Symbol.iterator] = function() {
                return iterator;
            };
        }

        return iterator;
    }

    function parseToDict(search) {
        var dict = {};

        if (typeof search === "object") {
            // if `search` is an array, treat it as a sequence
            if (isArray(search)) {
                for (var i = 0; i < search.length; i++) {
                    var item = search[i];
                    if (isArray(item) && item.length === 2) {
                        appendTo(dict, item[0], item[1]);
                    } else {
                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
                    }
                }

            } else {
                for (var key in search) {
                    if (search.hasOwnProperty(key)) {
                        appendTo(dict, key, search[key]);
                    }
                }
            }

        } else {
            // remove first '?'
            if (search.indexOf("?") === 0) {
                search = search.slice(1);
            }

            var pairs = search.split("&");
            for (var j = 0; j < pairs.length; j++) {
                var value = pairs [j],
                    index = value.indexOf('=');

                if (-1 < index) {
                    appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));

                } else {
                    if (value) {
                        appendTo(dict, decode(value), '');
                    }
                }
            }
        }

        return dict;
    }

    function appendTo(dict, name, value) {
        var val = typeof value === 'string' ? value : (
            value !== null && value !== undefined && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value)
        );

        // #47 Prevent using `hasOwnProperty` as a property name
        if (hasOwnProperty(dict, name)) {
            dict[name].push(val);
        } else {
            dict[name] = [val];
        }
    }

    function isArray(val) {
        return !!val && '[object Array]' === Object.prototype.toString.call(val);
    }

    function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

})(typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : (typeof window !== 'undefined' ? window : this));


/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var url_search_params_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url-search-params-polyfill */ "./node_modules/url-search-params-polyfill/index.js");
/* harmony import */ var url_search_params_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url_search_params_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fetch_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fetch-polyfill */ "./node_modules/fetch-polyfill/fetch.js");
/* harmony import */ var fetch_polyfill__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fetch_polyfill__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/state */ "./src/js/utils/state.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/functions */ "./src/js/utils/functions.js");
/* harmony import */ var _utils_ajax__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/ajax */ "./src/js/utils/ajax.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/data */ "./src/js/utils/data.js");








  
///////////////////////////////////
///// CALLING READY FUNCTION
_utils_functions__WEBPACK_IMPORTED_MODULE_3__.ready(() => {

    /////
    // SHOW MODAL
    /////

    const params = new URLSearchParams(window.location.search);
    
    if (params.has('payment')) {

        const payment = params.get('payment');

        if (payment === 'success') {
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Úspěch', 'Platba proběhla úspěšně. Faktura k objednávce Vám přišla na e-mail.', 'OK')
        } else if (payment === 'canceled') {
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Storno', 'Platba byla přerušena, ale prodejce byl o Vaší objednávce informován a vyřeší to s Vámi osobní domluvou.', 'OK')
        }

        if(payment === 'BTR') {

            if(params.has('success') && params.has('mailSent')) {

                const success = params.get('success');
                const mailSent = params.get('mailSent');

                if(success === 'true' && mailSent === 'true') {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Odesláno', 'Objednávka byla odeslána. <em> Byl vám zaslán mail, prosím, postupujte podle pokynů v něm. </em>', 'OK', true)
                }

                if(success === 'true' && mailSent === 'false') {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Nepovedlo se odeslat e-mail', '<em> Objednávku jsme zaregistrovali, ale nepodařil se odeslat mail s informacemi k platbě. Prosím, kontaktujte mě na adrese keramikarosice@seznam.cz </em>', 'OK', true)
                }

                if(success === 'false' && mailSent === 'true') {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Chyba', 'Nastala chyba, objednávku se nepodařilo odeslat.', 'OK')
                }

                if(success === 'false' && mailSent === 'false') {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Chyba', 'Nastala chyba, objednávku se nepodařilo odeslat.', 'OK')
                }

            }
            
        }

        if(payment === 'DOB') {
            
            if(params.has('success') && params.has('mailSent')) {

                const success = params.get('success');
                const mailSent = params.get('mailSent');

                if(success === 'true' && mailSent === 'true') {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Úspěch', 'Objednávka proběhla úspěšně. Faktura vám přišla na mail.', 'OK')
                }

                if(success === 'true' && mailSent === 'false') {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Úspěch', 'Objednávka proběhla úspěšně', 'OK')
                }

                if(success === 'false' && mailSent === 'true') {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Chyba', 'Nastala chyba, objednávku se nepodařilo odeslat.', 'OK')
                }

                if(success === 'false' && mailSent === 'false') {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.createModal('Chyba', 'Nastala chyba, objednávku se nepodařilo odeslat..', 'OK')
                }
            }
            
        }
    }

    /////
    // MENU
    /////

    // Select hamburger button and attach click listener
    const hamburgerBtn = _utils_state__WEBPACK_IMPORTED_MODULE_2__.default.hamburgerBtn = document.querySelector("#hamburger-btn");
    const headerList = hamburgerBtn.nextElementSibling;
    const headerBackDrop = document.querySelector('.header__backdrop');

    const toggleHeader = (e) => {
        e.stopPropagation();

        if(![hamburgerBtn.classList].includes('header__nav-button--hiding')) {

            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.showOrHideEl(hamburgerBtn, 'header__nav-button--show', 'header__nav-button--hide', 'header__nav-button--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.showOrHideEl(headerList, 'header__nav-list--hidden', 'header__nav-list--visible', 'header__nav-list--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.showOrHideEl(headerBackDrop, 'header__backdrop--hidden', 'header__backdrop--visible', 'header__backdrop--hiding');

            for (const listItem of headerList.children) {
                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.showOrHideEl(listItem, 'header__nav-item--hidden', 'header__nav-item--visible', 'header__nav-item--hiding');
            }
        }
    }
    headerBackDrop.addEventListener('click', toggleHeader);
    hamburgerBtn.addEventListener("click", toggleHeader);

    ///// Initial update cart amount
    
    const cartAmountEl = document.querySelector('.header__cart-amount');
    const cartAmount = +cartAmountEl.textContent;
    if(cartAmount > 0) {
        cartAmountEl.style.display = 'flex';
    }

    /////
    // CATEGORIES SLIDER
    /////

    // Try to find #categories-slider
    const categoriesSlider = document.getElementById("categories-slider");
    // If #categories-slider found
    if (categoriesSlider) {
        // Find arrows
        const arrowLeft = document.getElementById("arrow-left");
        const arrowRight = document.getElementById("arrow-right");
        
        // Attach click listener to arrows
        arrowLeft.addEventListener("click", () => {
            _utils_state__WEBPACK_IMPORTED_MODULE_2__.default.categoriesSlider.selectedArr = 'left';
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.moveCategoriesSlider();
        });
        arrowRight.addEventListener("click", () => {
            _utils_state__WEBPACK_IMPORTED_MODULE_2__.default.categoriesSlider.selectedArr = 'right';
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.moveCategoriesSlider();
        });        
    }

    /////
    // CART
    /////

    ///// TO ORDER BUTTON

    const toOrderBtn = document.getElementById('to-order');
    if(toOrderBtn) {
        const orderSection = document.getElementById('cart-order');

        toOrderBtn.addEventListener('click', () => {
            orderSection.scrollIntoView({behavior: 'smooth'});
        })
    }
    
    /////
    // CART & ORDER
    /////

    ///// Submit button event listener
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', _utils_ajax__WEBPACK_IMPORTED_MODULE_4__.orderSubmitHandler);

        _utils_functions__WEBPACK_IMPORTED_MODULE_3__.updateCartPage();
    }


    // Agreement checkbox event listeners 
    
    const agreeGDPR = document.getElementById('agree-gdpr');
    const agreeConditions = document.getElementById('agree-conditions');
    const submitToCartBtn = document.getElementById('submit-order');
    if(orderForm) {
        agreeGDPR.addEventListener('input', () => {
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.refreshSubmitBtn(agreeGDPR, agreeConditions, submitToCartBtn);
        })
        agreeConditions.addEventListener('input', () => {
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.refreshSubmitBtn(agreeGDPR, agreeConditions, submitToCartBtn);
        });
    }

    ///// Input Validation
    if(orderForm) {
        for (const input of _utils_data__WEBPACK_IMPORTED_MODULE_5__.formELs) {
            input.addEventListener('input', _utils_functions__WEBPACK_IMPORTED_MODULE_3__.validateInput.bind(undefined, input));
        }
    }

    //// Managing cart items
    const cartItems = document.querySelectorAll('.cart-item');

    if(orderForm) {

        const frogAudio = new Audio('/img/frogAudio.mp3');
        orderForm.querySelector('#firstName').addEventListener('input', _utils_functions__WEBPACK_IMPORTED_MODULE_3__.easterTime.bind(undefined, frogAudio));

        for(const cartItem of cartItems) {

            const addButton = cartItem.querySelector('.cart-item__amount-box__btn--add');
            const removeButton = cartItem.querySelector('.cart-item__amount-box__btn--remove');
            const removeAllButton = cartItem.querySelector('.close-button');

            addButton.addEventListener('click', async () => {

                const postCartData = {
                    action: 'ADD',
                    productId: cartItem.dataset.productid,
                    csrf: cartItem.dataset.csrf,
                    amount: 1
                }
                
                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.addToCart(postCartData).then((updatedCart) => {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.updateCartItem(cartItem, updatedCart);
                });
            });
            removeButton.addEventListener('click', () => {

                const postCartData = {
                    action: 'REMOVE',
                    productId: cartItem.dataset.productid,
                    csrf: cartItem.dataset.csrf,
                    amount: 1
                }
                
                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.removeFromCart(postCartData).then((updatedCart) => {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.updateCartItem(cartItem, updatedCart);

                    
                });
            })
            removeAllButton.addEventListener('click', () => {

                const postCartData = {
                    action: 'REMOVE',
                    productId: cartItem.dataset.productid,
                    csrf: cartItem.dataset.csrf,
                    amount: false
                }

                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.removeFromCart(postCartData).then( (updatedCart) => {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.updateCartItem(cartItem, updatedCart);
                })

            })
        }
    }
    

    /////
    // E-SHOP
    /////

    ///// SUBMIT TO CART BUTTON
    const eshopProducts = document.querySelector('.eshop__products');

    if (eshopProducts) {
        const submitBtns = eshopProducts.querySelectorAll('.post-order-btn');

        for (const btn of submitBtns) {
            btn.addEventListener('click', () => {

                // Create object with action ('ADD' || 'REMOVE'), productId, csrf, amount
                const postCartData = {
                    action: 'ADD',
                    productId: btn.dataset.productid,
                    csrf: btn.dataset.csrf,
                    amount: btn.parentElement.querySelector('select').value
                }

                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.addToCart(postCartData).then((updatedCart) => {
                    _utils_functions__WEBPACK_IMPORTED_MODULE_3__.updateCartIcon(updatedCart);
                }).catch(err => console.log(err));
                
            })
        }
    }

    ///// CATEGORY SELECT
    const categorySelect = document.querySelector('.category-select');

    if (categorySelect) {
        
       
        const categorySelectButtons = categorySelect.querySelectorAll('.category-select__button');

        for (const btn of categorySelectButtons) {
            const list = btn.parentElement.querySelector('.category-select__subcategory-list');
        
            btn.addEventListener('click', () => {
                // changes the button style
                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.switchClass(btn, 'category-select__button--show', 'category-select__button--hide');
                // shows or removes the subcategory list
                if(list) {_utils_functions__WEBPACK_IMPORTED_MODULE_3__.showOrHideEl(list, 'category-select__subcategory-list--hidden', 'category-select__subcategory-list--visible', 'category-select__subcategory-list--hiding');}
            });
        }

        ///// PRODUCT MODAL
        const products = document.querySelectorAll('.product');

        for (const prod of products) {
            const btnShowProdModal = prod.querySelector('.product__info .to-cart-button');
            const btnCloseProdModal = prod.querySelector('.product__modal__close-button');
            const modal = prod.querySelector('.product__modal');
            const btnAddToCart = modal.querySelector('.to-cart-button');
            
            btnShowProdModal.addEventListener('click', () => {
                // Shows product modal
                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');

                // Removing focus from the showProdModal button
                btnShowProdModal.blur();

                 // Focusing the modal, so the keydown event can be registered on it
                modal.focus();
            });
            btnCloseProdModal.addEventListener('click', () => {
                // Hides product modal
                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');
            });   
            btnAddToCart.addEventListener('click', () => {
                // Hides product modal
                _utils_functions__WEBPACK_IMPORTED_MODULE_3__.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');
            })   
            modal.addEventListener('click', () => {
                // Focusing the, so the keydown event can be registered on it
                modal.focus();
            })
            modal.addEventListener('keydown', (e) => {
                // If the user pressed enter, simulating click on the add-to-cart button
                if(e.key === 'Enter') {
                    btnAddToCart.click();
                }
             })
            
        }

        ///// MOBILE CATEGORY SELECT
        const categorySelectMobileBtn = categorySelect.querySelector('button');

        const categorySelectList = categorySelectMobileBtn.parentElement.querySelector('.category-select__category-list');
        const categorySelectHeading = categorySelectMobileBtn.parentElement.querySelector('.heading-2');
        const categorySelectBackdrop = document.querySelector('.category-select__backdrop');
        
        const footer = document.querySelector('footer');
    
        window.addEventListener('scroll', () => {
            const footerY = footer.getBoundingClientRect().y;
            const btnY = categorySelectMobileBtn.getBoundingClientRect().y;
    
            if (footerY >= btnY) {
                categorySelectList.classList.remove('scrollLocked');
                categorySelectHeading.classList.remove('scrollLocked');
            } else {
                categorySelectList.classList.add('scrollLocked');
                categorySelectHeading.classList.add('scrollLocked');
            }
        });
    
        // Toggle category select on mobile devices

        const toggleCategorySelect = () => {
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.showOrHideEl(categorySelectList, 'category-select__category-list--hidden', 'category-select__category-list--visible', 'category-select__category-list--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.showOrHideEl(categorySelectHeading, 'heading-2--hidden', 'heading-2--visible', 'heading-2--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.showOrHideEl(categorySelectBackdrop, 'category-select__backdrop--hidden', 'category-select__backdrop--visible', 'category-select__backdrop--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_3__.switchClass(categorySelectMobileBtn, 'category-select__mobile-button--show', 'category-select__mobile-button--hide');
    
            if ([...categorySelectMobileBtn.classList].includes('category-select__mobile-button--show')) {
                categorySelectMobileBtn.textContent = 'Zobrazit kategorie';
            } else {
                categorySelectMobileBtn.textContent = 'Skrýt kategorie';
            }
        }

        categorySelectMobileBtn.addEventListener('click', toggleCategorySelect);
        categorySelectBackdrop.addEventListener('click', toggleCategorySelect);
    }
});


  

/***/ }),

/***/ "./src/js/utils/ajax.js":
/*!******************************!*\
  !*** ./src/js/utils/ajax.js ***!
  \******************************/
/*! namespace exports */
/*! export orderSubmitHandler [provided] [no usage info] [missing usage info prevents renaming] */
/*! export postCartHandler [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "postCartHandler": function() { return /* binding */ postCartHandler; },
/* harmony export */   "orderSubmitHandler": function() { return /* binding */ orderSubmitHandler; }
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./src/js/utils/functions.js");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data */ "./src/js/utils/data.js");



const postCartHandler = async ({ action, csrf, amount, productId }) => {
    switch (action) {
        case 'ADD':
        case 'REMOVE':

            // Create body object
            const bodyObj = {
                action: action,
                amount: amount,
                productId: productId
            };
            
            console.log(bodyObj);

            // Send request
            return fetch('/kosik', {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': csrf,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(bodyObj)
            }).then(res => {
                return Promise.all([res, res.json()]);
            }).then(promises => {
                const [ response, body ] = promises;
                if (!(response.ok && response.status >= 200 && response.status < 300)) {

                    throw new Error(body.msg);
                }
                const updatedCart = body.cart;                
                return updatedCart;
            }).catch(err => {
                throw new Error(err);
            });

            break;
        default: throw new Error('Non-existing cart action');
    }
}

const orderSubmitHandler = e => {

    ///// Validatings input values 

    const emailValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.email);
    const firstNameValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.firstName);
    const lastNameValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.lastName);
    const phoneValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.phone);
    const streetValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.street);
    const cityValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.city);
    const zipCodeValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.zipCode);
    const deliveryValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.delivery);
    const paymentValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.payment);
    const packetaIdValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.packetaId);
console.log();
    // If validation has failed (at least one element has class 'invalid'), returning
    
    if (document.querySelector('.invalid')) {
        e.preventDefault();
        return;
    }
     return;  
    // Show spinner on submit button
    const submitBtn = e.target.elements.order_submit;
    const submitBtnText = submitBtn.textContent;
    submitBtn.textContent = "";
    submitBtn.classList.add('loading');

    ///// Handle getting stripe session id and stripe redirection
    if (paymentValue === 'CRD') {
        e.preventDefault();

        // Get form elements and stripe public key
        const stripePublicKey = e.target.dataset.stripepublickey;
        const formEls = e.target.elements;

        // Initialize stripe
        const stripe = Stripe(stripePublicKey);
        
        // Create new form data
        const formData = new FormData();
        formData.append('_csrf', formEls._csrf.value);
        formData.append('packetaId', packetaIdValue);
        formData.append('firstName', firstNameValue);
        formData.append('lastName', lastNameValue);
        formData.append('email', emailValue);
        formData.append('phone', phoneValue);
        formData.append('street', streetValue);
        formData.append('city', cityValue);
        formData.append('delivery', deliveryValue);
        formData.append('payment', paymentValue);
        formData.append('zipCode', zipCodeValue);

        // Fetch POST /objednavka, expecting json
        fetch('/objednavka', {
            method: 'POST',
            body: formData
        }).then(res => {
            return res.json();
        }).then(session => {
            return stripe.redirectToCheckout({ sessionId: session.id });
        }).then(result => {
            if (result.error) {
                _functions__WEBPACK_IMPORTED_MODULE_0__.createModal('Nastala chyba', 'Platba se nezdařila, prosím kontaktujte mě na e-mailu keramikarosice@seznam.cz', 'OK');
            }
        }).catch(err => {
            _functions__WEBPACK_IMPORTED_MODULE_0__.createModal('Nastala chyba', 'Objednávka se nezdařila, prosím kontaktujte mě na e-mailu keramikarosice@seznam.cz', 'OK');
        }).finally(() => {
            submitBtn.textContent = submitBtnText;
            submitBtn.classList.remove('loading');
        })
    }
}




/***/ }),

/***/ "./src/js/utils/data.js":
/*!******************************!*\
  !*** ./src/js/utils/data.js ***!
  \******************************/
/*! namespace exports */
/*! export RegexMap [provided] [no usage info] [missing usage info prevents renaming] */
/*! export formELs [provided] [no usage info] [missing usage info prevents renaming] */
/*! export otherArgsMap [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formELs": function() { return /* binding */ formELs; },
/* harmony export */   "RegexMap": function() { return /* binding */ RegexMap; },
/* harmony export */   "otherArgsMap": function() { return /* binding */ otherArgsMap; }
/* harmony export */ });
////
//SUBMIT
//
const orderForm = document.getElementById('order-form');

const formELs = orderForm ? orderForm.elements : undefined;

const RegexMap = orderForm ? new Map([
    [formELs.email, /^[a-zA-Z0-9!#$_*?^{}~-]+(\.[a-zA-Z0-9!#$_*?^{}~-]+)*@([a-zA-Z-]+\.)+[a-zA-z]{2,}$/],
    [formELs.firstName, /(.+){2,}/],
    [formELs.lastName, /(.+){2,}/],
    [formELs.phone, /^[0-9]{9}$/],
    [formELs.street, /(.+){2,}/],
    [formELs.city, /(.+){2,}/],
    [formELs.zipCode, /[0-9]{5}/],
    [formELs.delivery, /(ZAS|POS|OOD|ADR)/],
    [formELs.payment, /(DOB|CRD|BTR)/],
    [formELs.packetaId, /[0-9]{1,}/]
]
) : undefined;


const otherArgsMap = orderForm ? new Map([
    // [input, [markedElId, removeWhiteSpace]]
    [formELs.phone, [undefined, true]],
    [formELs.zipCode, [undefined, true]],
    [formELs.payment, ['order-payment']],
    [formELs.delivery, ['order-delivery']],
    [formELs.packetaId, ['order-delivery']]
]) : undefined;

/***/ }),

/***/ "./src/js/utils/functions.js":
/*!***********************************!*\
  !*** ./src/js/utils/functions.js ***!
  \***********************************/
/*! namespace exports */
/*! export addToCart [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createCartHint [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createModal [provided] [no usage info] [missing usage info prevents renaming] */
/*! export easterTime [provided] [no usage info] [missing usage info prevents renaming] */
/*! export moveCategoriesSlider [provided] [no usage info] [missing usage info prevents renaming] */
/*! export outerWidth [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ready [provided] [no usage info] [missing usage info prevents renaming] */
/*! export refreshSubmitBtn [provided] [no usage info] [missing usage info prevents renaming] */
/*! export removeCartHint [provided] [no usage info] [missing usage info prevents renaming] */
/*! export removeFromCart [provided] [no usage info] [missing usage info prevents renaming] */
/*! export removeModal [provided] [no usage info] [missing usage info prevents renaming] */
/*! export showOrHideEl [provided] [no usage info] [missing usage info prevents renaming] */
/*! export switchClass [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateCartIcon [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateCartItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateCartPage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateTotalPrice [provided] [no usage info] [missing usage info prevents renaming] */
/*! export validateInput [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ready": function() { return /* binding */ ready; },
/* harmony export */   "outerWidth": function() { return /* binding */ outerWidth; },
/* harmony export */   "showOrHideEl": function() { return /* binding */ showOrHideEl; },
/* harmony export */   "switchClass": function() { return /* binding */ switchClass; },
/* harmony export */   "moveCategoriesSlider": function() { return /* binding */ moveCategoriesSlider; },
/* harmony export */   "refreshSubmitBtn": function() { return /* binding */ refreshSubmitBtn; },
/* harmony export */   "validateInput": function() { return /* binding */ validateInput; },
/* harmony export */   "createModal": function() { return /* binding */ createModal; },
/* harmony export */   "removeModal": function() { return /* binding */ removeModal; },
/* harmony export */   "removeCartHint": function() { return /* binding */ removeCartHint; },
/* harmony export */   "createCartHint": function() { return /* binding */ createCartHint; },
/* harmony export */   "addToCart": function() { return /* binding */ addToCart; },
/* harmony export */   "removeFromCart": function() { return /* binding */ removeFromCart; },
/* harmony export */   "updateCartItem": function() { return /* binding */ updateCartItem; },
/* harmony export */   "updateCartPage": function() { return /* binding */ updateCartPage; },
/* harmony export */   "updateTotalPrice": function() { return /* binding */ updateTotalPrice; },
/* harmony export */   "updateCartIcon": function() { return /* binding */ updateCartIcon; },
/* harmony export */   "easterTime": function() { return /* binding */ easterTime; }
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/js/utils/data.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/js/utils/state.js");
/* harmony import */ var _ajax__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ajax */ "./src/js/utils/ajax.js");




///////////////////////////////////
///// DEFINING FUNCTIONS

/////
// ready function to execute when DOM is loaded
/////
const ready = callbackFunc => {
    if (document.readyState !== 'loading') {
        // Document is already ready, call the callback directly
        callbackFunc();
    } else if (document.addEventListener) {
        // All modern browsers to register DOMContentLoaded
        document.addEventListener('DOMContentLoaded', callbackFunc);
    } else {
        // Old IE browsers
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState === 'complete') {
                callbackFunc();
            }
        });
    }
}
  
/////
// Utilities functions
/////
const outerWidth = (el) => {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
}

// Rendering the element or removing it from the screen smoothly - with animations
// The element must have 3 CSS Classes available - hidden class, visible class, hiding class
// Hidden class - display: none, no animation
// Visible class - display: block (or whatever except none) and an animation of the element appearing on the page (sliding -in or so)
// Hiding class - animation of the element disappearing
// Element has only one of these classes at a time.
// The hiding class is changed to hidden class after 'animationend' event on the element
const showOrHideEl = (element, hiddenClass, visibleClass, hidingClass) => {
    if([...element.classList].includes(hiddenClass)) {
        element.classList.remove(hiddenClass);
        element.classList.add(visibleClass);
    } else {
        element.classList.remove(visibleClass);
        element.classList.add(hidingClass);

        const animationEndHandler =  function(event) {
        if(event.pseudoElement) {
            element.addEventListener('animationend', animationEndHandler,  {
            capture: false,
            once: true,
            passive: false
            });
            return;
        }
        element.classList.remove(hidingClass);
        element.classList.add(hiddenClass);
        }

        element.addEventListener('animationend', animationEndHandler, {
        capture: false,
        once: true,
        passive: false
        });
    }
}

// Switching between two classes, if an element has a class A, the class A is replaced for class B, if an element has a class B, the class B is replaced for the class A
const switchClass = (el, classA, classB) => {
    if ([...el.classList].includes(classA)) {
        el.classList.remove(classA);
        el.classList.add(classB);
    } else {
        el.classList.remove(classB);
        el.classList.add(classA);
    }
}

/////
// Categories slider
/////
const moveCategoriesSlider = () => {
    // Find #categoires-scrollable-container
    const scrollableContainer = document.getElementById("categories-scrollable-container");

    // Find .categories-category
    const categoryEl = document.querySelector('.categories-category');
    // Find categoryEl width with margin
    const moveInPixels = outerWidth(categoryEl);

    // Conditionally scroll to left or to right
    if (_state__WEBPACK_IMPORTED_MODULE_1__.default.categoriesSlider.selectedArr === 'left') {
        scrollableContainer.scrollBy({
        top: 0,
        left: -moveInPixels,
        behavior: "smooth"
        });
    } else if (_state__WEBPACK_IMPORTED_MODULE_1__.default.categoriesSlider.selectedArr === 'right') {
        scrollableContainer.scrollBy({
        top: 0,
        left: moveInPixels,
        behavior: "smooth"
        });
    }
}

/////
// SUBMIT
/////

//// Managing the disabled state
const refreshSubmitBtn = (agreeGDPR, agreeConditions, submitToCartBtn)  => {
    
    // If both inputs are checked, disabled class on the submit button is removed
   if (agreeGDPR.checked && agreeConditions.checked) {

       submitToCartBtn.classList.remove('disabled');
       submitToCartBtn.removeAttribute('disabled');

   } else {

    submitToCartBtn.classList.add('disabled');
    submitToCartBtn.setAttribute('disabled', '');

   }
}
function validateInput(input) {

    // Getting regex for the current input
   const inputRegExp = _data__WEBPACK_IMPORTED_MODULE_0__.RegexMap.get(input);
    if(!inputRegExp) {
        return;
    }

    // Getting other arguments, if otherArgsMap contains them for current input
    let markedElId;
    let removeWhiteSpace;
    if (_data__WEBPACK_IMPORTED_MODULE_0__.otherArgsMap.get(input)) {
        [markedElId, removeWhiteSpace] = _data__WEBPACK_IMPORTED_MODULE_0__.otherArgsMap.get(input);
    }
    
    // Getting input value, if specified, removing all single space characters (f.e in the case of zipcode)
    let inputValue;
    if (removeWhiteSpace) {
        inputValue = input.value.trim().replace(/\s/g, "");
    } else {
        inputValue = input.value.trim();
    }

    
    // Getting element, on which the 'invalid' class is added in validation fail cases
    let markedEl;
    if (markedElId) {
        markedEl = document.getElementById(markedElId);
    } else {
        markedEl = input;
    }

    // If input value doesn´t match the regular expression, validation 'fails' - the invalid class is added on markedEl, new Error is thrown
    if(!inputRegExp.test(inputValue)) {
        markedEl.classList.add('invalid');
    } else {
        markedEl.classList.remove('invalid');
    }

    return inputValue;
}
/////
// MODAL
/////
const createModal = (text, subText, buttonText) => {
    const modal = document.createElement('div');
    const body = document.body;

    modal.classList.add('modal');
    modal.innerHTML = `<div class="modal__backdrop"></div>
    <div class="modal__window">
        <div class="modal__text">${text}</div>
        <div class="modal__subtext">${subText}</div>
        <button class="modal__button">${buttonText}</button>
        <div class="close-button"></div>
    </div>`;
   
    body.appendChild(modal);

    const modalButton = modal.querySelector('.modal__button');
    const modalCloseButton = modal.querySelector('.close-button');

    modalButton.addEventListener('click', removeModal.bind(undefined, modal));
    modalCloseButton.addEventListener('click', removeModal.bind(undefined, modal))
}

const removeModal = modal => {
    modal.parentElement.removeChild(modal);
}
/////
// CART-HINT
/////
const removeCartHint = cartHint => {
    cartHint.parentElement.removeChild(cartHint);
}
const createCartHint = (state, text) => {

    // Removing current cart hint if any
    const currentCartHint = document.querySelector('.cart-hint');

    if(currentCartHint) {
        currentCartHint.parentElement.removeChild(currentCartHint);
    }

    // State = 'success' | 'failed'
    if(state !== 'success' && state !== 'failed') {
        return;
    }

    let cartHint = document.createElement('div');
    const body = document.body;

    cartHint.classList.add('cart-hint');
    cartHint.classList.add('cart-hint--visible');
    cartHint.classList.add(`cart-hint--${state}`);
    cartHint.innerHTML = `<div class="cart-hint__text">
    ${text}
    </div>
    <div class="cart-hint__symbol cart-hint__symbol--${state}">

    </div>
    <button class="close-button">

    </button>`;

    body.appendChild(cartHint);

    const cartHintCloseButton = cartHint.querySelector('button');
    cartHintCloseButton.addEventListener('click', removeCartHint.bind(undefined, cartHint));

    // Cart hint gradually dissapears after 5 seconds
    setTimeout(() => {
        if(cartHint) {
            cartHint.addEventListener('animationend', () => {
                removeCartHint(cartHint);
            })
            switchClass(cartHint, 'cart-hint--visible', 'cart-hint--hiding');
        }
    }, 5000)
}
/////
//CART
/////
const addToCart = (postCartData) => {

    return _ajax__WEBPACK_IMPORTED_MODULE_2__.postCartHandler(postCartData)
    .then((updatedCart) => {
        createCartHint('success', `Produkt byl úspěšně přidán do košíku`);         
        return updatedCart;           
    }).catch(err => {
        console.log(err);
        createCartHint('failed', `Nastala chyba, produkt nebyl přidán do košíku`);
    });

};
const removeFromCart = (postCartData) => {

    return _ajax__WEBPACK_IMPORTED_MODULE_2__.postCartHandler(postCartData)
    .then((updatedCart) => {
        createCartHint('success', `Produkt byl úspěšně odebrán z košíku`);         
        return updatedCart;           
    }).catch(err => {
        createCartHint('failed', `Nastala chyba, produkt nebyl odebrán z košíku`);
    });

}
const updateCartItem = (cartItem, updatedCart) => {

    const cartItemObj = updatedCart.items.find(item => {
        return item.product._id = cartItem.dataset.productid;
    })

    const amountEl = cartItem.querySelector('.cart-item__amount-box__amount');
    const priceEl = cartItem.querySelector('.cart-item__price');

    if(!cartItemObj) {

        cartItem.parentElement.removeChild(cartItem);

    } else {

        amountEl.textContent = `${cartItemObj.amount}ks`;
        priceEl.textContent = +cartItemObj.product.price * cartItemObj.amount + 'Kč';

    }

    updateTotalPrice(updatedCart);
    updateCartPage();
    updateCartIcon(updatedCart);
}

const updateCartPage = () => {
    
    const cartItem = document.querySelector('.cart-item');

    const cartOrder = document.getElementById('cart-order');
    const emptyCartContent = document.querySelector('.cart__cart-content__empty');
    const summary = document.querySelector('.cart__cart-content__summary');
    const dph = document.querySelector('.cart__cart-content__dph');
    const button = document.getElementById('to-order');

    if(!cartItem) {

        cartOrder.style.display = 'none';
        summary.style.display  = 'none';
        emptyCartContent.style.display = 'block';
        dph.style.display = 'none';
        button.classList.remove('hidden');
        button.classList.add('hidden');

    } else {

        cartOrder.style.display = 'flex';
        summary.style.display  = 'flex';
        emptyCartContent.style.display = 'none';
        dph.style.display = 'block';
        button.classList.remove('hidden');
    }
}

const updateTotalPrice  = (updatedCart) => {
    
    const priceEl = document.querySelector(".cart__cart-content__summary__price");

    priceEl.textContent = `${updatedCart.total}Kč`;

}
/////
//HEADER
/////
const updateCartIcon = (updatedCart) => {
    const cartAmountEl = document.querySelector('.header__cart-amount');
    const cartAmount = updatedCart.items.reduce((prevValue, curValue, id) => {
        return prevValue + updatedCart.items[id].amount;
    }, 0)
    if(cartAmount <= 0) {
        cartAmountEl.style.display = 'none';
    } else {
        cartAmountEl.style.display = 'flex';
    }
    cartAmountEl.textContent = cartAmount;
}

const easterTime = (frogAudio, e) => {
    const string = e.target.value;
    const showEaster = () => {
        const frog = document.createElement('img');
        frog.style.width = '50px';
        frog.style.height = '50px';
        frog.style.position = 'absolute';
        frog.style.top = '50%';
        frog.style.left = '50%';
        frog.style.objectFit = 'cover';
        frog.setAttribute('src', '/img/frog.png');
        frog.style.animation = 'easterAnimation 2.8s linear';
        document.querySelector('body').prepend(frog);
        setTimeout(() => {
            const audio = frogAudio.cloneNode();
            audio.play();                
        }, 100);
        setTimeout(() => {
            frog.parentElement.removeChild(frog);
        }, 2800);
    }
    if (string === 'boomer' || string === 'Boomer') {
        showEaster();
    }
    if (string === 'BOOMER') {
        const easterInterval = setInterval(() => {
            showEaster();
        }, 400);
        setTimeout(() => {
            clearInterval(easterInterval);
        }, 2000);
    }
}

/***/ }),

/***/ "./src/js/utils/state.js":
/*!*******************************!*\
  !*** ./src/js/utils/state.js ***!
  \*******************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
///////////////////////////////////
///// DEFINE STATE
/* harmony default export */ __webpack_exports__["default"] = ({
    categoriesSlider: {
        selectedArr: null // 'left' || 'right'
    },
    hamburgerBtn: null
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/js/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=index.js.map