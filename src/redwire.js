// Generated by CoffeeScript 1.8.0
var Bindings, RedWire, TcpProxy, WebProxy, copy,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

Bindings = require('./bindings');

WebProxy = require('./web-proxy');

TcpProxy = require('./tcp-proxy');

copy = function(source, target) {
  var key, value, _results;
  _results = [];
  for (key in source) {
    value = source[key];
    if (typeof value === 'object') {
      if ((target[key] == null) || typeof target[key] !== 'object') {
        target[key] = {};
      }
      _results.push(copy(value, target[key]));
    } else {
      _results.push(target[key] = value);
    }
  }
  return _results;
};

module.exports = RedWire = (function() {
  function RedWire(options) {
    this.close = __bind(this.close, this);
    this.getBindings = __bind(this.getBindings, this);
    this.setBindings = __bind(this.setBindings, this);
    this.createNewBindings = __bind(this.createNewBindings, this);
    this.clear = __bind(this.clear, this);
    this.clearTls = __bind(this.clearTls, this);
    this.clearTcp = __bind(this.clearTcp, this);
    this.clearHttpsWs = __bind(this.clearHttpsWs, this);
    this.clearHttpWs = __bind(this.clearHttpWs, this);
    this.clearHttps = __bind(this.clearHttps, this);
    this.clearHttp = __bind(this.clearHttp, this);
    this.removeHttpsWs = __bind(this.removeHttpsWs, this);
    this.removeHttpWs = __bind(this.removeHttpWs, this);
    this.removeHttps = __bind(this.removeHttps, this);
    this.removeHttp = __bind(this.removeHttp, this);
    this.tls = __bind(this.tls, this);
    this.tcp = __bind(this.tcp, this);
    this.httpsWs = __bind(this.httpsWs, this);
    this.httpWs = __bind(this.httpWs, this);
    this.https = __bind(this.https, this);
    this.http = __bind(this.http, this);
    this.proxyTls = __bind(this.proxyTls, this);
    this.proxyTcp = __bind(this.proxyTcp, this);
    this.proxyWs = __bind(this.proxyWs, this);
    this.proxy = __bind(this.proxy, this);
    this.cors = __bind(this.cors, this);
    this.loadBalancer = __bind(this.loadBalancer, this);
    this.sslRedirect = __bind(this.sslRedirect, this);
    this.setHost = __bind(this.setHost, this);
    this._options = {
      http: {
        port: 8080,
        websockets: false
      },
      https: false,
      tcp: false,
      tls: false,
      proxy: {
        xfwd: true,
        prependPath: false
      }
    };
    copy(options, this._options);
    this._bindings = this.createNewBindings();
    if ((this._options.http != null) || (this._options.https != null)) {
      this._webProxy = new WebProxy(this._options, (function(_this) {
        return function() {
          return _this._bindings;
        };
      })(this));
    }
    if ((this._options.tcp != null) || (this._options.tls != null)) {
      this._tcpProxy = new TcpProxy(this._options, (function(_this) {
        return function() {
          return _this._bindings;
        };
      })(this));
    }
  }

  RedWire.prototype.setHost = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._webProxy).setHost.apply(_ref, args);
  };

  RedWire.prototype.sslRedirect = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._webProxy).sslRedirect.apply(_ref, args);
  };

  RedWire.prototype.loadBalancer = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._webProxy).loadBalancer.apply(_ref, args);
  };

  RedWire.prototype.cors = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._webProxy).cors.apply(_ref, args);
  };

  RedWire.prototype.proxy = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._webProxy).proxy.apply(_ref, args);
  };

  RedWire.prototype.proxyWs = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._webProxy).proxyWs.apply(_ref, args);
  };

  RedWire.prototype.proxyTcp = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._tcpProxy).proxyTcp.apply(_ref, args);
  };

  RedWire.prototype.proxyTls = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._tcpProxy).proxyTls.apply(_ref, args);
  };

  RedWire.prototype.http = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).http.apply(_ref, args);
  };

  RedWire.prototype.https = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).https.apply(_ref, args);
  };

  RedWire.prototype.httpWs = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).httpWs.apply(_ref, args);
  };

  RedWire.prototype.httpsWs = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).httpsWs.apply(_ref, args);
  };

  RedWire.prototype.tcp = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).tcp.apply(_ref, args);
  };

  RedWire.prototype.tls = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).tls.apply(_ref, args);
  };

  RedWire.prototype.removeHttp = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).removeHttp.apply(_ref, args);
  };

  RedWire.prototype.removeHttps = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).removeHttps.apply(_ref, args);
  };

  RedWire.prototype.removeHttpWs = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).removeHttpWs.apply(_ref, args);
  };

  RedWire.prototype.removeHttpsWs = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this._bindings).removeHttpsWs.apply(_ref, args);
  };

  RedWire.prototype.clearHttp = function() {
    return this._bindings.clearHttp();
  };

  RedWire.prototype.clearHttps = function() {
    return this._bindings.clearHttps();
  };

  RedWire.prototype.clearHttpWs = function() {
    return this._bindings.clearHttpWs();
  };

  RedWire.prototype.clearHttpsWs = function() {
    return this._bindings.clearHttpsWs();
  };

  RedWire.prototype.clearTcp = function() {
    return this._bindings.clearTcp();
  };

  RedWire.prototype.clearTls = function() {
    return this._bindings.clearTls();
  };

  RedWire.prototype.clear = function() {
    return this._bindings.clear();
  };

  RedWire.prototype.createNewBindings = function() {
    return new Bindings(this);
  };

  RedWire.prototype.setBindings = function(bindings) {
    return this._bindings = bindings;
  };

  RedWire.prototype.getBindings = function() {
    return this._bindings;
  };

  RedWire.prototype.close = function(cb) {
    if (this._webProxy != null) {
      this._webProxy.close();
    }
    if (this._tcpProxy != null) {
      this._tcpProxy.close();
    }
    if (cb != null) {
      return cb();
    }
  };

  return RedWire;

})();
