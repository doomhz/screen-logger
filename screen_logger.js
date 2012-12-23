
/*

  ScreenLogger

  @version 1.0
  @author  Dumitru Glavan
  @link    http://jslogger.com
  @link    http://dumitruglavan.com
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.ScreenLogger = (function() {

    ScreenLogger.prototype.logger = null;

    ScreenLogger.prototype.html2CanvasUrl = "//jslogger.com/html2canvas.js";

    function ScreenLogger(options) {
      if (options == null) options = {};
      this.onClick = __bind(this.onClick, this);
      this.setupEvents = __bind(this.setupEvents, this);
      this.logger = options.logger;
      this.session = options.session || new Date().getTime();
      this.loadDependencies(this.setupEvents);
    }

    ScreenLogger.prototype.loadDependencies = function(callback) {
      var script;
      if (!window.html2canvas) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = this.html2CanvasUrl;
        script.onload = callback;
        return document.getElementsByTagName("body")[0].appendChild(script);
      } else {
        if (typeof callback !== void 0) return callback();
      }
    };

    ScreenLogger.prototype.setupEvents = function() {
      return document.onclick = this.onClick;
    };

    ScreenLogger.prototype.log = function(data, extraParams) {
      if (this.logger && this.logger.track) {
        return this.logger.logDataByType("screen", data, extraParams);
      }
    };

    ScreenLogger.prototype.takeScreenshot = function(callback) {
      var opts;
      opts = {
        logging: true,
        useCORS: true,
        onrendered: function(canvas) {
          var content;
          try {
            content = canvas.toDataURL();
            return callback(content);
          } catch (e) {
            console.log(e);
            return console.log(canvas);
          }
        }
      };
      return html2canvas(document.getElementsByTagName("body"), opts);
    };

    ScreenLogger.prototype.onClick = function(e) {
      var extraParams,
        _this = this;
      extraParams = {
        event: {
          type: "click",
          x: e.clientX,
          y: e.clientY
        }
      };
      return this.takeScreenshot(function(image) {
        extraParams.img = image;
        return _this.log(_this.session, extraParams);
      });
    };

    return ScreenLogger;

  })();

}).call(this);
