"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

!function () {
  "use strict";

  var _this = this;

  var e = { categoriesSlider: { selectedArr: null }, hamburgerBtn: null };var t = document.getElementById("order-form"),
      n = t ? t.elements : void 0,
      o = t ? new _map2.default([[n.email, /^[a-zA-Z0-9!#$_*?^{}~-]+(\.[a-zA-Z0-9!#$_*?^{}~-]+)*@([a-zA-Z-]+\.)+[a-zA-z]{2,}$/], [n.firstName, /(.+){2,}/], [n.lastName, /(.+){2,}/], [n.phone, /^[0-9]{9}$/], [n.street, /(.+){2,}/], [n.city, /(.+){2,}/], [n.zipCode, /[0-9]{5}/], [n.delivery, /(ZAS|POS|OOD)/], [n.payment, /(DOB|CRD|BTR)/]]) : void 0,
      a = t ? new _map2.default([[n.phone, [void 0, !0]], [n.zipCode, [void 0, !0]], [n.payment, ["order-payment"]], [n.delivery, ["order-delivery"]]]) : void 0,
      s = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
      var e = _ref2.action,
          t = _ref2.csrf,
          n = _ref2.amount,
          o = _ref2.productId;

      var _a;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = e;
              _context.next = _context.t0 === "ADD" ? 3 : _context.t0 === "REMOVE" ? 3 : 5;
              break;

            case 3:
              _a = { action: e, amount: n, productId: o };
              return _context.abrupt("return", fetch("/kosik", { method: "POST", headers: { "X-CSRF-Token": t, "Content-Type": "application/json", Accept: "application/json" }, body: (0, _stringify2.default)(_a) }).then(function (e) {
                return _promise2.default.all([e.clone(), e.json()]);
              }).then(function (e) {
                var _e = (0, _slicedToArray3.default)(e, 2),
                    t = _e[0],
                    n = _e[1];

                if (!(t.ok && t.status >= 200 && t.status < 300)) throw new Error(n.msg);return n.cart;
              }).catch(function (e) {
                throw new Error(e);
              }));

            case 5:
              throw new Error("Non-existing cart action");

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function s(_x) {
      return _ref.apply(this, arguments);
    };
  }(),
      c = function c(e) {
    var t = u(n.email),
        o = u(n.firstName),
        a = u(n.lastName),
        s = u(n.phone),
        c = u(n.street),
        d = u(n.city),
        r = u(n.zipCode),
        i = u(n.delivery),
        l = u(n.payment);if (document.querySelector(".invalid")) return void e.preventDefault();var y = e.target.elements.order_submit,
        p = y.textContent;if (y.textContent = "", y.classList.add("loading"), "CRD" === l) {
      e.preventDefault();var _n = e.target.dataset.stripepublickey,
          _u = e.target.elements,
          _2 = Stripe(_n),
          _h = new FormData();_h.append("_csrf", _u._csrf.value), _h.append("firstName", o), _h.append("lastName", a), _h.append("email", t), _h.append("phone", s), _h.append("street", c), _h.append("city", d), _h.append("delivery", i), _h.append("payment", l), _h.append("zipCode", r), fetch("/objednavka", { method: "POST", body: _h }).then(function (e) {
        return e.json();
      }).then(function (e) {
        return _2.redirectToCheckout({ sessionId: e.id });
      }).then(function (e) {
        e.error && m("Nastala chyba", "Platba se nezdařila, prosím kontaktujte mě na e-mailu keramikarosice@seznam.cz", "OK");
      }).catch(function (e) {
        m("Nastala chyba", "Objednávka se nezdařila, prosím kontaktujte mě na e-mailu keramikarosice@seznam.cz", "OK");
      }).finally(function () {
        y.textContent = p, y.classList.remove("loading");
      });
    }
  },
      d = function d(e, t, n, o) {
    if ([].concat((0, _toConsumableArray3.default)(e.classList)).includes(t)) e.classList.remove(t), e.classList.add(n);else {
      e.classList.remove(n), e.classList.add(o);var _a2 = function _a2(n) {
        n.pseudoElement ? e.addEventListener("animationend", _a2, { capture: !1, once: !0, passive: !1 }) : (e.classList.remove(o), e.classList.add(t));
      };e.addEventListener("animationend", _a2, { capture: !1, once: !0, passive: !1 });
    }
  },
      r = function r(e, t, n) {
    [].concat((0, _toConsumableArray3.default)(e.classList)).includes(t) ? (e.classList.remove(t), e.classList.add(n)) : (e.classList.remove(n), e.classList.add(t));
  },
      i = function i() {
    var t = document.getElementById("categories-scrollable-container"),
        n = function (e) {
      var t = e.offsetWidth;var n = getComputedStyle(e);return t += parseInt(n.marginLeft) + parseInt(n.marginRight), t;
    }(document.querySelector(".categories-category"));"left" === e.categoriesSlider.selectedArr ? t.scrollBy({ top: 0, left: -n, behavior: "smooth" }) : "right" === e.categoriesSlider.selectedArr && t.scrollBy({ top: 0, left: n, behavior: "smooth" });
  },
      l = function l(e, t, n) {
    e.checked && t.checked ? (n.classList.remove("disabled"), n.removeAttribute("disabled")) : (n.classList.add("disabled"), n.setAttribute("disabled", ""));
  };function u(e) {
    var _a$get, _a$get2;

    var t = o.get(e);if (!t) return;var n = void 0,
        s = void 0,
        c = void 0,
        d = void 0;return a.get(e) && (_a$get = a.get(e), _a$get2 = (0, _slicedToArray3.default)(_a$get, 2), n = _a$get2[0], s = _a$get2[1], _a$get), c = s ? e.value.trim().replace(/\s/g, "") : e.value.trim(), d = n ? document.getElementById(n) : e, t.test(c) ? d.classList.remove("invalid") : d.classList.add("invalid"), c;
  }var m = function m(e, t, n) {
    var o = document.createElement("div"),
        a = document.body;o.classList.add("modal"), o.innerHTML = "<div class=\"modal__backdrop\"></div>\n    <div class=\"modal__window\">\n        <div class=\"modal__text\">" + e + "</div>\n        <div class=\"modal__subtext\">" + t + "</div>\n        <button class=\"modal__button\">" + n + "</button>\n        <div class=\"close-button\"></div>\n    </div>", a.appendChild(o);var s = o.querySelector(".modal__button"),
        c = o.querySelector(".close-button");s.addEventListener("click", y.bind(void 0, o)), c.addEventListener("click", y.bind(void 0, o));
  },
      y = function y(e) {
    e.parentElement.removeChild(e);
  },
      p = function p(e) {
    e.parentElement.removeChild(e);
  },
      _ = function _(e, t) {
    var n = document.querySelector(".cart-hint");if (n && n.parentElement.removeChild(n), "success" !== e && "failed" !== e) return;var o = document.createElement("div");var a = document.body;o.classList.add("cart-hint"), o.classList.add("cart-hint--visible"), o.classList.add("cart-hint--" + e), o.innerHTML = "<div class=\"cart-hint__text\">\n    " + t + "\n    </div>\n    <div class=\"cart-hint__symbol cart-hint__symbol--" + e + "\">\n\n    </div>\n    <button class=\"close-button\">\n\n    </button>", a.appendChild(o), o.querySelector("button").addEventListener("click", p.bind(void 0, o)), setTimeout(function () {
      o && (o.addEventListener("animationend", function () {
        p(o);
      }), r(o, "cart-hint--visible", "cart-hint--hiding"));
    }, 5e3);
  },
      h = function h(e) {
    return s(e).then(function (e) {
      return _("success", "Produkt byl úspěšně přidán do košíku"), e;
    }).catch(function (e) {
      _("failed", "Nastala chyba, produkt nebyl přidán do košíku");
    });
  },
      b = function b(e) {
    return s(e).then(function (e) {
      return _("success", "Produkt byl úspěšně odebrán z košíku"), e;
    }).catch(function (e) {
      _("failed", "Nastala chyba, produkt nebyl odebrán z košíku");
    });
  },
      v = function v(e, t) {
    var n = t.items.find(function (t) {
      return t.product._id = e.dataset.productid;
    }),
        o = e.querySelector(".cart-item__amount-box__amount"),
        a = e.querySelector(".cart-item__price");n ? (o.textContent = n.amount + "ks", a.textContent = +n.product.price * n.amount + "Kč") : e.parentElement.removeChild(e), f(t), g(), k(t);
  },
      g = function g() {
    var e = document.querySelector(".cart-item"),
        t = document.getElementById("cart-order"),
        n = document.querySelector(".cart__cart-content__empty"),
        o = document.querySelector(".cart__cart-content__summary"),
        a = document.querySelector(".cart__cart-content__dph"),
        s = document.getElementById("to-order");e ? (t.style.display = "flex", o.style.display = "flex", n.style.display = "none", a.style.display = "block", s.classList.remove("hidden")) : (t.style.display = "none", o.style.display = "none", n.style.display = "block", a.style.display = "none", s.classList.remove("hidden"), s.classList.add("hidden"));
  },
      f = function f(e) {
    document.querySelector(".cart__cart-content__summary__price").textContent = e.total + "Kč";
  },
      k = function k(e) {
    var t = document.querySelector(".header__cart-amount"),
        n = e.items.reduce(function (t, n, o) {
      return t + e.items[o].amount;
    }, 0);t.style.display = n <= 0 ? "none" : "flex", t.textContent = n;
  },
      L = function L(e, t) {
    var n = t.target.value,
        o = function o() {
      var t = document.createElement("img");t.style.width = "50px", t.style.height = "50px", t.style.position = "absolute", t.style.top = "50%", t.style.left = "50%", t.style.objectFit = "cover", t.setAttribute("src", "/img/frog.png"), t.style.animation = "easterAnimation 2.8s linear", document.querySelector("body").prepend(t), setTimeout(function () {
        e.cloneNode().play();
      }, 100), setTimeout(function () {
        t.parentElement.removeChild(t);
      }, 2800);
    };if ("boomer" !== n && "Boomer" !== n || o(), "BOOMER" === n) {
      var _e2 = setInterval(function () {
        o();
      }, 400);setTimeout(function () {
        clearInterval(_e2);
      }, 2e3);
    }
  };var E;E = function E() {
    var t = new URLSearchParams(window.location.search);if (t.has("payment")) {
      var _e3 = t.get("payment");if ("success" === _e3 ? m("Úspěch", "Objednávka proběhla úspěšně", "OK") : "canceled" === _e3 && m("Storno", "Platba byla přerušena, ale prodejce byl o Vaší objednávce informován a vyřeší to s Vámi osobní domluvou.", "OK"), "BTR" === _e3 && t.has("success") && t.has("mailSent")) {
        var _e4 = t.get("success"),
            _n2 = t.get("mailSent");"true" === _e4 && "true" === _n2 && m("Odesláno", "Objednávka byla odeslána. <em> Byl vám zaslán mail, prosím, postupujte podle pokynů v něm. </em>", "OK", !0), "true" === _e4 && "false" === _n2 && m("Chyba", "<em> Nepodařil se odeslat mail s informacemi k platbě, prosím, kontaktujte mě na adrese keramikarosice@seznam.cz </em>", "OK", !0), "false" === _e4 && "true" === _n2 && m("Chyba", "Nastala chyba, objednávka nebyla odeslána.", "OK"), "false" === _e4 && "false" === _n2 && m("Chyba", "Nastala chyba, objednávka nebyla odeslána. ", "OK");
      }if ("DOB" === _e3 && t.has("success") && t.has("mailSent")) {
        var _e5 = t.get("success"),
            _n3 = t.get("mailSent");"true" === _e5 && "true" === _n3 && m("Úspěch", "Objednávka proběhla úspěšně", "OK"), "true" === _e5 && "false" === _n3 && m("Úspěch", "Objednávka proběhla úspěšně", "OK"), "false" === _e5 && "true" === _n3 && m("Chyba", "Nastala chyba, objednávka nebyla odeslána", "OK"), "false" === _e5 && "false" === _n3 && m("Chyba", "Nastala chyba, objednávka nebyla odeslána.", "OK");
      }
    }var o = e.hamburgerBtn = document.querySelector("#hamburger-btn"),
        a = o.nextElementSibling,
        s = document.querySelector(".header__backdrop"),
        y = function y(e) {
      if (e.stopPropagation(), ![o.classList].includes("header__nav-button--hiding")) {
        d(o, "header__nav-button--show", "header__nav-button--hide", "header__nav-button--hiding"), d(a, "header__nav-list--hidden", "header__nav-list--visible", "header__nav-list--hiding"), d(s, "header__backdrop--hidden", "header__backdrop--visible", "header__backdrop--hiding");var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(a.children), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _e6 = _step.value;
            d(_e6, "header__nav-item--hidden", "header__nav-item--visible", "header__nav-item--hiding");
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    };s.addEventListener("click", y), o.addEventListener("click", y);var p = document.querySelector(".header__cart-amount");if (+p.textContent > 0 && (p.style.display = "flex"), document.getElementById("categories-slider")) {
      var _t = document.getElementById("arrow-left"),
          _n4 = document.getElementById("arrow-right");_t.addEventListener("click", function () {
        e.categoriesSlider.selectedArr = "left", i();
      }), _n4.addEventListener("click", function () {
        e.categoriesSlider.selectedArr = "right", i();
      });
    }var _ = document.getElementById("to-order");if (_) {
      var _e7 = document.getElementById("cart-order");_.addEventListener("click", function () {
        _e7.scrollIntoView({ behavior: "smooth" });
      });
    }var f = document.getElementById("order-form");f && (f.addEventListener("submit", c), g());var E = document.getElementById("agree-gdpr"),
        S = document.getElementById("agree-conditions"),
        q = document.getElementById("submit-order");if (f && (E.addEventListener("input", function () {
      l(E, S, q);
    }), S.addEventListener("input", function () {
      l(E, S, q);
    })), f) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(n), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _e8 = _step2.value;
          _e8.addEventListener("input", u.bind(void 0, _e8));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }var C = document.querySelectorAll(".cart-item");if (f) {
      var _e9 = new Audio("/img/frogAudio.mp3");f.querySelector("#firstName").addEventListener("input", L.bind(void 0, _e9));var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop = function _loop() {
          var e = _step3.value;
          var t = e.querySelector(".cart-item__amount-box__btn--add"),
              n = e.querySelector(".cart-item__amount-box__btn--remove"),
              o = e.querySelector(".close-button");t.addEventListener("click", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            var t;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    t = { action: "ADD", productId: e.dataset.productid, csrf: e.dataset.csrf, amount: 1 };
                    h(t).then(function (t) {
                      v(e, t);
                    });
                  case 2:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, _this);
          }))), n.addEventListener("click", function () {
            var t = { action: "REMOVE", productId: e.dataset.productid, csrf: e.dataset.csrf, amount: 1 };b(t).then(function (t) {
              v(e, t);
            });
          }), o.addEventListener("click", function () {
            var t = { action: "REMOVE", productId: e.dataset.productid, csrf: e.dataset.csrf, amount: !1 };b(t).then(function (t) {
              v(e, t);
            });
          });
        };

        for (var _iterator3 = (0, _getIterator3.default)(C), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }var O = document.querySelector(".eshop__products");if (O) {
      var _e10 = O.querySelectorAll(".post-order-btn");var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        var _loop2 = function _loop2() {
          var t = _step4.value;
          t.addEventListener("click", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var e;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    e = { action: "ADD", productId: t.dataset.productid, csrf: t.dataset.csrf, amount: t.parentElement.querySelector("input").value };
                    h(e).then(function (e) {
                      k(e);
                    });
                  case 2:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, _this);
          })));
        };

        for (var _iterator4 = (0, _getIterator3.default)(_e10), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }var B = document.querySelector(".category-select");if (B) {
      var _e11 = B.querySelectorAll(".category-select__button");var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        var _loop3 = function _loop3() {
          var t = _step5.value;
          var e = t.parentElement.querySelector(".category-select__subcategory-list");t.addEventListener("click", function () {
            r(t, "category-select__button--show", "category-select__button--hide"), e && d(e, "category-select__subcategory-list--hidden", "category-select__subcategory-list--visible", "category-select__subcategory-list--hiding");
          });
        };

        for (var _iterator5 = (0, _getIterator3.default)(_e11), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          _loop3();
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var _t2 = document.querySelectorAll(".product");var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        var _loop4 = function _loop4() {
          var e = _step6.value;
          var t = e.querySelector(".product__info .to-cart-button"),
              n = e.querySelector(".product__modal__close-button"),
              o = e.querySelector(".product__modal"),
              a = o.querySelector(".to-cart-button"),
              s = o.querySelector("input");t.addEventListener("click", function () {
            r(o, "product__modal--toggled", "product__modal--hidden");
          }), n.addEventListener("click", function () {
            r(o, "product__modal--toggled", "product__modal--hidden");
          }), a.addEventListener("click", function () {
            r(o, "product__modal--toggled", "product__modal--hidden");
          }), s.addEventListener("input", function () {
            /^[0-9]{1,}$/.test(s.value) ? (s.classList.remove("invalid"), a.removeAttribute("disabled", "")) : (s.classList.add("invalid"), a.setAttribute("disabled", ""));
          });
        };

        for (var _iterator6 = (0, _getIterator3.default)(_t2), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          _loop4();
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var _n5 = B.querySelector("button"),
          _o = _n5.parentElement.querySelector(".category-select__category-list"),
          _a3 = _n5.parentElement.querySelector(".heading-2"),
          _s = document.querySelector(".category-select__backdrop"),
          _c = document.querySelector("footer");window.addEventListener("scroll", function () {
        _c.getBoundingClientRect().y >= _n5.getBoundingClientRect().y ? (_o.classList.remove("scrollLocked"), _a3.classList.remove("scrollLocked")) : (_o.classList.add("scrollLocked"), _a3.classList.add("scrollLocked"));
      });var _i = function _i() {
        d(_o, "category-select__category-list--hidden", "category-select__category-list--visible", "category-select__category-list--hiding"), d(_a3, "heading-2--hidden", "heading-2--visible", "heading-2--hiding"), d(_s, "category-select__backdrop--hidden", "category-select__backdrop--visible", "category-select__backdrop--hiding"), r(_n5, "category-select__mobile-button--show", "category-select__mobile-button--hide"), [].concat((0, _toConsumableArray3.default)(_n5.classList)).includes("category-select__mobile-button--show") ? _n5.textContent = "Zobrazit kategorie" : _n5.textContent = "Skrýt kategorie";
      };_n5.addEventListener("click", _i), _s.addEventListener("click", _i);
    }
  }, "loading" !== document.readyState ? E() : document.addEventListener ? document.addEventListener("DOMContentLoaded", E) : document.attachEvent("onreadystatechange", function () {
    "complete" === document.readyState && E();
  });
}();
