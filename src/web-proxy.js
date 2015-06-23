// Generated by CoffeeScript 1.9.2
var CertificateStore, LoadBalancer, WebProxy, format_url, http, http_proxy, https, parse_url,
  bind1 = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

http = require('http');

https = require('https');

http_proxy = require('http-proxy');

parse_url = require('url').parse;

format_url = require('url').format;

CertificateStore = require('./certificate-store');

LoadBalancer = require('./load-balancer');

module.exports = WebProxy = (function() {
  function WebProxy(options, bindings) {
    this.close = bind1(this.close, this);
    this.redirect302 = bind1(this.redirect302, this);
    this._redirect302 = bind1(this._redirect302, this);
    this.redirect301 = bind1(this.redirect301, this);
    this._redirect301 = bind1(this._redirect301, this);
    this._redirectParseRel = bind1(this._redirectParseRel, this);
    this.redirect302absolute = bind1(this.redirect302absolute, this);
    this._redirect302absolute = bind1(this._redirect302absolute, this);
    this.redirect301absolute = bind1(this.redirect301absolute, this);
    this._redirect301absolute = bind1(this._redirect301absolute, this);
    this._redirect = bind1(this._redirect, this);
    this._redirectParseUrl = bind1(this._redirectParseUrl, this);
    this.error500 = bind1(this.error500, this);
    this._error500 = bind1(this._error500, this);
    this.error404 = bind1(this.error404, this);
    this._error404 = bind1(this._error404, this);
    this.cors = bind1(this.cors, this);
    this.sslRedirect = bind1(this.sslRedirect, this);
    this.loadBalancer = bind1(this.loadBalancer, this);
    this.setHost = bind1(this.setHost, this);
    this.proxyWs = bind1(this.proxyWs, this);
    this.proxy = bind1(this.proxy, this);
    this._startProxy = bind1(this._startProxy, this);
    this._startHttps = bind1(this._startHttps, this);
    this._startHttp = bind1(this._startHttp, this);
    this._translateUrl = bind1(this._translateUrl, this);
    this._parseHostPort = bind1(this._parseHostPort, this);
    this._parseSource = bind1(this._parseSource, this);
    var ref, ref1;
    this._options = options;
    this._bindings = bindings;
    if (this._options.http) {
      this._startHttp();
    }
    if (this._options.https) {
      this._startHttps();
    }
    if (this._options.proxy) {
      this._startProxy();
    }
    if (((ref = this._options.http) != null ? ref.routes : void 0) != null) {
      setTimeout((function(_this) {
        return function() {
          var ref1, results, source, target;
          ref1 = _this._options.http.routes;
          results = [];
          for (source in ref1) {
            target = ref1[source];
            results.push(_this._bindings().http(source, target));
          }
          return results;
        };
      })(this), 1);
    }
    if (((ref1 = this._options.https) != null ? ref1.routes : void 0) != null) {
      setTimeout((function(_this) {
        return function() {
          var ref2, results, source, target;
          ref2 = _this._options.https.routes;
          results = [];
          for (source in ref2) {
            target = ref2[source];
            results.push(_this._bindings().https(source, target));
          }
          return results;
        };
      })(this), 1);
    }
  }

  WebProxy.prototype._parseSource = function(req, protocol) {
    var chunks, source;
    source = parse_url(req.url);
    source.protocol = protocol;
    source.host = req.headers.host;
    chunks = source.host.split(':');
    source.hostname = chunks[0];
    source.port = chunks[1] || null;
    source.href = source.protocol + "//" + source.host + source.path;
    source.slashes = true;
    return source;
  };

  WebProxy.prototype._parseHostPort = function(options, defaulthost, defaultport) {
    var chunks, result;
    result = {
      port: defaultport,
      hostname: defaulthost
    };
    if (options.port != null) {
      if (typeof options.port === 'string' && options.port.indexOf(':') !== -1) {
        chunks = options.port.split(':');
        result.hostname = chunks[0];
        result.port = chunks[1];
      } else {
        result.port = options.port;
      }
    }
    if (options.hostname != null) {
      if (typeof options.hostname === 'string' && options.hostname.indexOf(':') !== -1) {
        chunks = options.hostname.split(':');
        result.hostname = chunks[0];
        result.port = chunks[1];
      } else {
        result.hostname = options.hostname;
      }
    }
    return result;
  };

  WebProxy.prototype._translateUrl = function(mount, target, url) {
    mount = parse_url(mount);
    target = parse_url(target);
    url = parse_url(url);
    return "" + target.pathname + url.path.slice(mount.pathname.length);
  };

  WebProxy.prototype._startHttp = function() {
    var bind;
    bind = this._parseHostPort(this._options.http, '0.0.0.0', 8080);
    this._options.http.port = bind.port;
    this._options.http.hostname = bind.hostname;
    this._httpServer = http.createServer((function(_this) {
      return function(req, res) {
        req.source = _this._parseSource(req, 'http:');
        return _this._bindings()._http.exec(req.source.href, req, res, _this._error404);
      };
    })(this));
    if (this._options.http.websockets) {
      this._options.log.notice('http server configured for websockets');
      this._httpServer.on('upgrade', (function(_this) {
        return function(req, socket, head) {
          req.source = _this._parseSource(req, 'http:');
          return _this._bindings()._httpWs.exec(req.source.href, req, socket, head, _this._error404);
        };
      })(this));
    }
    this._httpServer.on('error', (function(_this) {
      return function(err, req, res) {
        if ((req != null) && (res != null)) {
          _this._error500(req, res, err);
        }
        _this._options.log.error(err);
        try {
          if (res != null) {
            return res.end();
          }
        } catch (_error) {}
      };
    })(this));
    this._httpServer.listen(this._options.http.port, this._options.http.hostname);
    return this._options.log.notice("http server listening on " + this._options.http.hostname + ":" + this._options.http.port);
  };

  WebProxy.prototype._startHttps = function() {
    var bind;
    this.certificates = new CertificateStore();
    bind = this._parseHostPort(this._options.https, '0.0.0.0', 8443);
    this._options.https.port = bind.port;
    this._options.https.hostname = bind.hostname;
    this._httpsServer = https.createServer(this.certificates.getHttpsOptions(this._options.https), (function(_this) {
      return function(req, res) {
        req.source = _this._parseSource(req, 'https:');
        return _this._bindings()._https.exec(req.source.href, req, res, _this._error404);
      };
    })(this));
    if (this._options.https.websockets) {
      this._options.log.notice("https server configured for websockets");
      this._httpsServer.on('upgrade', (function(_this) {
        return function(req, socket, head) {
          req.source = _this._parseSource(req, 'https:');
          return _this._bindings()._httpsWs.exec(req.source.href, req, socket, head, _this._error404);
        };
      })(this));
    }
    this._httpsServer.on('error', (function(_this) {
      return function(err, req, res) {
        if ((req != null) && (res != null)) {
          _this._error500(req, res, err);
        }
        _this._options.log.error(err);
        try {
          if (res != null) {
            return res.end();
          }
        } catch (_error) {}
      };
    })(this));
    this._httpsServer.listen(this._options.https.port, this._options.https.hostname);
    return this._options.log.notice("https server listening on " + this._options.https.hostname + ":" + this._options.https.port);
  };

  WebProxy.prototype._startProxy = function() {
    this._proxy = http_proxy.createProxyServer(this._options.proxy);
    this._proxy.on('proxyReq', (function(_this) {
      return function(p, req, res, options) {
        if (req.host != null) {
          return p.setHeader('host', req.host);
        }
      };
    })(this));
    return this._proxy.on('error', (function(_this) {
      return function(err, req, res) {
        if ((req != null) && (typeof res === "function" ? res(!res.headersSent) : void 0)) {
          _this._error500(req, res, err);
        }
        _this._options.log.error(err);
        try {
          if (res != null) {
            return res.end();
          }
        } catch (_error) {}
      };
    })(this));
  };

  WebProxy.prototype.proxy = function(target) {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        var t;
        t = target;
        if ((t != null) && t.indexOf('http://') !== 0 && t.indexOf('https://') !== 0) {
          t = "http://" + t;
        }
        if (t == null) {
          t = req.target;
        }
        if (t == null) {
          return next();
        }
        url = _this._translateUrl(mount, t, url);
        _this._options.log.notice(mount + " proxy " + req.url + " url");
        req.url = url;
        return _this._proxy.web(req, res, {
          target: t
        });
      };
    })(this);
  };

  WebProxy.prototype.proxyWs = function(target) {
    return (function(_this) {
      return function(mount, url, req, socket, head, next) {
        var t;
        t = target;
        if ((t != null) && t.indexOf('http://') !== 0 && t.indexOf('https://') !== 0) {
          t = "http://" + t;
        }
        if (t == null) {
          t = req.target;
        }
        if (t == null) {
          return next();
        }
        url = _this._translateUrl(mount, t, url);
        _this._options.log.notice(mount + " proxy " + req.url + " url");
        req.url = url;
        return _this._proxy.ws(req, socket, head, {
          target: t
        });
      };
    })(this);
  };

  WebProxy.prototype.setHost = function(host) {
    return (function(_this) {
      return function() {
        var args, i, mount, next, req, url;
        mount = arguments[0], url = arguments[1], req = arguments[2], args = 5 <= arguments.length ? slice.call(arguments, 3, i = arguments.length - 1) : (i = 3, []), next = arguments[i++];
        req.host = host;
        return next();
      };
    })(this);
  };

  WebProxy.prototype.loadBalancer = function(options) {
    return new LoadBalancer(options);
  };

  WebProxy.prototype.sslRedirect = function(port) {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        var target;
        target = parse_url(req.url);
        if (port != null) {
          target.port = port;
        }
        if (_this._options.https.port != null) {
          target.port = _this._options.https.port;
        }
        target.hostname = req.source.hostname;
        target.protocol = 'https:';
        res.writeHead(302, {
          Location: format_url(target)
        });
        return res.end();
      };
    })(this);
  };

  WebProxy.prototype.cors = function(allowedHosts) {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        var referer;
        referer = req.headers.referer;
        if (referer == null) {
          return next();
        }
        referer = parse_url(referer);
        referer = format_url({
          protocol: referer.protocol,
          hostname: referer.hostname,
          port: referer.port
        });
        if (indexOf.call(allowedHosts, referer) < 0) {
          return next();
        }
        res.setHeader('Access-Control-Allow-Origin', referer);
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return next();
      };
    })(this);
  };

  WebProxy.prototype._error404 = function(req, res) {
    var result;
    result = {
      message: "No http proxy setup for " + req.source.href
    };
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(result, null, 2));
    return res.end();
  };

  WebProxy.prototype.error404 = function() {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        return _this._error404(req, res);
      };
    })(this);
  };

  WebProxy.prototype._error500 = function(req, res, err) {
    var result;
    result = {
      message: "Internal error for " + req.source.href,
      error: err
    };
    res.writeHead(500, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(result, null, 2));
    return res.end();
  };

  WebProxy.prototype.error500 = function() {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        return _this._error500(req, res, '');
      };
    })(this);
  };

  WebProxy.prototype._redirectParseUrl = function(url) {
    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
      url = "http://" + url;
    }
    return url;
  };

  WebProxy.prototype._redirect = function(req, res, code, location) {
    res.writeHead(code, {
      Location: location
    });
    return res.end();
  };

  WebProxy.prototype._redirect301absolute = function(req, res, location) {
    return this._redirect(req, res, 301, this._redirectParseUrl(location));
  };

  WebProxy.prototype.redirect301absolute = function(location) {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        return _this._redirect(req, res, 301, _this._redirectParseUrl(location));
      };
    })(this);
  };

  WebProxy.prototype._redirect302absolute = function(req, res, location) {
    return this._redirect(req, res, 302, this._redirectParseUrl(location));
  };

  WebProxy.prototype.redirect302absolute = function(location) {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        return _this._redirect(req, res, 302, _this._redirectParseUrl(location));
      };
    })(this);
  };

  WebProxy.prototype._redirectParseRel = function(location, url) {
    var target;
    target = this._redirectParseUrl(location);
    target += url;
    return target;
  };

  WebProxy.prototype._redirect301 = function(req, res, location) {
    return this._redirect(req, res, 301, this._redirectParseRel(location, req.url));
  };

  WebProxy.prototype.redirect301 = function(location) {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        return _this._redirect(req, res, 301, _this._redirectParseRel(location, req.url));
      };
    })(this);
  };

  WebProxy.prototype._redirect302 = function(req, res, location) {
    return this._redirect(req, res, 302, this._redirectParseRel(location, req.url));
  };

  WebProxy.prototype.redirect302 = function(location) {
    return (function(_this) {
      return function(mount, url, req, res, next) {
        return _this._redirect(req, res, 302, _this._redirectParseRel(location, req.url));
      };
    })(this);
  };

  WebProxy.prototype.close = function(cb) {
    if (this._httpServer != null) {
      this._httpServer.close();
    }
    if (this._httpsServer != null) {
      this._httpsServer.close();
    }
    if (this._proxy != null) {
      this._proxy.close();
    }
    if (cb != null) {
      return cb();
    }
  };

  return WebProxy;

})();
