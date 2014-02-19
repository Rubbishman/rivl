/*
 * Meteor Charts v0.0.11
 * http://www.meteorcharts.com
 * Copyright 2013, Eric Rowell
 * License http://www.meteorcharts.com/terms-of-use.html
 * Date: 2013-11-10
 */
 var MeteorCharts;
(function() {
  MeteorCharts = {
  	version: '0.0.11'
  };
})();

// Uses Node, AMD or browser globals to create a module.

// If you want something that will work in other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "returnExports" that depends another module called "b".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

// if the module has no dependencies, the above pattern can be simplified to
( function(root, factory) {
    if( typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    }
    else if( typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    }
    else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function() {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return MeteorCharts;
}));
;(function() {
  // constants
  var LEFT = 'left',
      CENTER = 'center',
      AUTO = 'auto',
      EMPTY_STRING = '',
      TEXT = 'Text',
      SPACE = ' ',
      HOVERING = 'hovering',
      ZOOMING = 'zooming',
      PANNING = 'panning';

  MeteorCharts.Chart = function(config) {
    this._init(config);
  };

  MeteorCharts.Chart.prototype = {
    _init: function(config) {
      var that = this;

      this.model = config.model || {};
      this.view = config.view || {};
      this._view = new MeteorCharts.View(this);
      this.events = {};
      this._setState(HOVERING);

      // create stage
      this.stage = new Kinetic.Stage({
        container: config.container,
        listening: false,
        width: this._view.get('width'),
        height: this._view.get('height'),
      });

      this.stage.getContainer().style.display = 'inline-block';
      this.stage.getContent().setAttribute('role', 'presentation');

      // layers
      this.bottomLayer = new Kinetic.Layer({listening: false});
      this.dataLayer = new Kinetic.Layer({listening: false});
      this.topLayer = new Kinetic.Layer({listening: false});
      this.interactionLayer = new Kinetic.Layer({
        opacity: 0,
        listening: false
      });

      // description
      this.content = document.createElement('div');
      this.content.style.textIndent = '-999999px';
      this.content.style.position = 'absolute';

      // add meteor classes
      this.bottomLayer.getCanvas()._canvas.className = 'meteorcharts-bottom-layer';
      this.dataLayer.getCanvas()._canvas.className = 'meteorcharts-data-layer';
      this.topLayer.getCanvas()._canvas.className = 'meteorcharts-top-layer';
      this.interactionLayer.getCanvas()._canvas.className = 'meteorcharts-interaction-layer';
      this.content.className = 'meteorcharts-content';

      this.stage.add(this.bottomLayer);
      this.stage.add(this.dataLayer);
      this.stage.add(this.topLayer);
      this.stage.add(this.interactionLayer);

      this.stage.getContainer().insertBefore(this.content, this.stage.getContent());

      this.title = new MeteorCharts.Title(this);

      this.interactionShow = new Kinetic.Tween({
        node: that.interactionLayer,
        duration: 0.3,
        opacity: 1,
        easing: Kinetic.Easings.EaseInOut
      });

      this._bind();
      


    },
    batchDraw: function() {
      this.enableSeriesTween = false;
      this.stage.batchDraw();
    },
    draw: function() {
      this.enableSeriesTween = true;
      this.stage.draw();
      this.fire('draw');
    },
    getView: function() {
      return this._view;
    },
    showInteractionLayer: function() {
      this.interactionShow.play();
    },
    hideInteractionLayer: function() {
      this.interactionShow.reverse();
    },
    on: function(evt, handler) {
      if (!this.events[evt]) {
        this.events[evt] = [];
      }
      this.events[evt].push(handler);
    },
    fire: function(evt) {
      var events = this.events[evt],
          len, n;

      if (events) {
        len = events.length;
        for (n=0; n<len; n++) {
          events[n]();
        }
      }
    },
    _setState: function(state) {
      this.state = state;
      this.fire('stateChange');
    },
    _getContent: function() {
      return '';
    },
    _addContent: function() {
      this.content.innerHTML = this._getContent();
    },
    _bind: function() {
      var stage = this.stage,
          that = this,
          keydown = false,
          startDistance = null;

        // manage keydown / up
      document.body.addEventListener('keydown', function(evt) {
        keydown = true;
      });

      document.body.addEventListener('keyup', function(evt) {
        keydown = false;
      });

      stage.on('contentTouchstart contentTouchend contentTouchmove', function(evt) {
        evt.preventDefault();
      });


      stage.on('contentMousedown', function() {
        switch (that.state) {
          case HOVERING:
            if (keydown) {
              that._setState(PANNING);
            }
            else {
              that._setState(ZOOMING);
            }
          case ZOOMING:
            that.zoom._startZoomSelect();

        }
      });

      stage.on('contentMousemove contentTouchmove contentTouchstart', function() {
        switch(that.state) {
          case HOVERING:
            that.pointerMove(); 
            break;
          case ZOOMING:
            that.tooltip.group.hide();
            that.zoom._resizeZoomSelect();
            break;
          case PANNING:
            that._pan();
            that.tooltip.group.hide();
            break;
        }

        that.lastPos = stage.getPointerPosition();
        that.interactionLayer.batchDraw();
      });

      stage.on('contentMouseup', function() {
        switch(that.state) {
          case ZOOMING:
            that.zoom._endZoomSelect();
            that._setState(HOVERING);
            that.tooltip.group.show();
            break;
          case PANNING:
            that._setState(HOVERING);
            that.tooltip.group.show();
            stage.draw();
            that.fire('draw');
            break;
        }
      });

      stage.on('contentTouchmove', function(evt) {
        that.zoom._pinch(evt);
      });

      stage.on('contentTouchend', function() {
        startDistance = null;
      });

      stage.on('contentMouseover contentTouchstart', function() {
        that.showInteractionLayer();
      });

      stage.on('contentMouseout contentTouchend', function() {
        that.hideInteractionLayer();
      });


      // bind before draw event to bottom layer because this is the
      // first layer in the stage that's drawn.  the _draw() method needs to 
      // execute immediately before drawing any of the stage layers
      this.bottomLayer.on('beforeDraw', function() {
        that._draw();
      });

      this.on('stateChange', function() {
        switch(that.state) {
          case HOVERING:
            //that.enableSeriesTween = true;
            break;
          case PANNING:
            //that.enableSeriesTween = false;
            break;
          case ZOOMING:
            //that.enableSeriesTween = true;
            break;
          default:
            //that.enableSeriesTween = true;
            break;
        }
      });
    }
  };
})();;(function() {
  MeteorCharts.Util = {
    merge: function(){
      var len = arguments.length,
          arr = Array.prototype.slice.call(arguments),
          n, attr, ret, val;

      if (this.containsObjects(arr)) {
        ret = {};
        for (n=0; n<len; n++) {
          val = arguments[n];
          for (attr in val) { ret[attr] = val[attr]; }
        }
      }
      else {
        for (n=len-1; n>=0; n--) {
          val = arguments[n];
          if (val !== undefined) {
            ret = val;
            break;
          }
        }
      }

      return ret;
    },
    extend: function(c1, c2) {
      for(var key in c2.prototype) {
        if(!( key in c1.prototype) && key !== 'init') {
          c1.prototype[key] = c2.prototype[key];
        }
      }
    },
    isObject: function(obj) {
      return (!!obj && obj.constructor == Object);
    },
    containsObjects: function(arr) {
      var len = arr.length,
          n, val;

      for (n=0; n<len; n++) {
        val = arr[n];
        if (val !== undefined && !this.isObject(val)) {
          return false;
        }
      }
      return true;
    },
    get: function(obj, arr) {
      var len = arr.length,
          n;

      for (n=0; n<len; n++) {
        obj = obj[arr[n]];
        if (obj === undefined) {
          break;
        }
      }

      if (n === len) {
        return obj;
      }
      else {
        return undefined;
      }
    },
    getDistance: function(p1, p2) {
      return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
    }
  };
})();;(function() {
  var baseIncrements = [
    1,
    2,
    5
  ];

  MeteorCharts.Formatter = function(min, max, maxNumberOfLabels) {
    this.min = min;
    this.max = max;
    this.range = this.max - this.min;
    this.maxNumberOfLabels = maxNumberOfLabels;
  };

  MeteorCharts.Formatter.prototype = {
    getIncrement: function() {
      var range = this.range,
          increments = this._getIncrements(),
          len = increments.length,
          maxNumberOfLabels = this.maxNumberOfLabels,
          increment, n;

      // return largest increment that obeys the max number of labels rule
      for (n=0; n<len; n++) {
        increment = increments[n];

        if (increment >= range / maxNumberOfLabels) {
          return increment
        }
      }

      // if we can't determine an increment, then return the range
      return range;
    },
    _getIncrements: function() {
      var arr = [],
      base = this.base,
      len = baseIncrements.length,
      n, i;

      for (n=0; n<8; n++) {
        for (i=0; i<len; i++) {
          arr.push(baseIncrements[i] * Math.pow(base, n));
        }
      }

      return arr;
    },
    each: function(fun) {
      var n = this.start(),
          max = this.max;

      while (n < max) {
        fun(n);
        n = this.next();
      }
    },
    getLongestValue: function() {
      return Math.max(
        Math.abs(this.max), 
        Math.abs(this.min)
      );
    },
    addCommas: function(nStr){
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    }
  };

})();;(function() {
  MeteorCharts.View = function(chart) {
    this.overrides = {};
    this.chart = chart;
  };

  MeteorCharts.View.DEFAULT = {
    backgroundColor: 'black',
    width: 900,
    height: 450,
    padding: 10,
    spacing: 10,
    title: {
      text: {
        fill: '#ccc',
        fontSize: 20
      }
    },
    legend: {
      text: {
        fill: '#ccc',
        fontSize: 18
      },
      spacing: 20
    },
    xAxis: {
      min: 'auto',
      max: 'auto',
      text: {
        fill: '#ccc',
        fontSize: 14
      },
      gridLines: {
        stroke: '#555',
        strokeWidth: 2
      },
      formatter: 'Date' // can be Number or Date
    },
    yAxis: {
      min: 'auto',
      max: 'auto',
      text: {
        fill: '#ccc',
        fontSize: 14
      },
      gridLines: {
        stroke: '#555',
        strokeWidth: 2
      },
      formatter: 'Number' // can be Number or Date
    },
    series: [
      {
        stroke: '#afe225', // light green
        strokeWidth: 2,
        lineJoin: 'round'
      },
      {
        stroke: '#76d0ff', // light blue
        strokeWidth: 2,
        lineJoin: 'round'
      },
      {
        stroke: '#fc009a', // pink
        strokeWidth: 2,
        lineJoin: 'round'
      },
      {
        stroke: '#ffff00', // yellow
        strokeWidth: 2,
        lineJoin: 'round'
      },
      {
        stroke: '#d200ff', // light purple
        strokeWidth: 2,
        lineJoin: 'round'
      },
      {
        stroke: '#ff9000', // orange
        strokeWidth: 2,
        lineJoin: 'round'
      },
      {
        stroke: '#00fcff', // turquoise
        strokeWidth: 2,
        lineJoin: 'round'
      }
    ],
    tooltip: {
      title: {
        fill: '#444',
        fontSize: 14,
        fontStyle: 'italic'
      },
      content: {
        fill: 'black',
        fontSize: 14,
        fontStyle: 'bold'
      },
      rect: {
        fill: '#e8e8e8',
        lineJoin: 'round',
        strokeWidth: 4,
        padding: 8
      },
      node: {
        stroke: '#e8e8e8',
        radius: 5,
        strokeWidth: 2
      },
      connector: {
        strokeWidth: 4,
        opacity: 0.4,
        points: [0, 0, 0, 0],
        dashArray: [10, 8]
      }
    },  
    zoom: {
      type: 'box', // can be box or range
      selection: {
        fill: 'white',
        opacity: 0.3
      }
    }
  };

  MeteorCharts.View.prototype = {
    /**
    * @example get('legend', 'text', 'fontSize');
    */
    get: function() {
      var arr = Array.prototype.slice.call(arguments),
          util = MeteorCharts.Util,
          get = util.get,
          def = MeteorCharts.View.DEFAULT,
          view = this.chart.view,
          overrides = this.overrides;

      return util.merge(
        get(def, arr),
        get(view, arr),
        get(overrides, arr)
      );
    },
    /**
    * @example set('legend', 'text', 'fontSize', 16);
    */
    set: function() {
      var view = this.chart.view,
          a0 = arguments[0],
          a1 = arguments[1],
          a2, a3;

      switch (arguments.length) {
        case 2: 
          view[a0] = a1;
          break;
        case 3: 
          a2 = arguments[2];
          if (view[a0] === undefined) {
            view[a0] = {};
          }
          view[a0][a1] = a2;
          break;
        case 4:
          a2 = arguments[2];
          a3 = arguments[3];
          if (view[a0] === undefined) {
            view[a0] = {};
          }
          if (view[a0][a1] === undefined) {
            view[a0][a1] = {};
          }
          view[a0][a1][a2] = a3;
          break; 
      }

    },
    getSeriesStyle: function(n) {
      var series = this.get('series'),
          len = series.length;

      return series[n % len];
    },
  };
})();;(function() {
  MeteorCharts.Number = function() {
    MeteorCharts.Formatter.apply(this, arguments);
    this.base = 10;
    this.increment = this.getIncrement();
  };

  MeteorCharts.Number.prototype = {
    short: function(num) {
      var longestValue = this.getLongestValue();

      if (longestValue < 10) {
        return Math.round(num);
      }
      else if (longestValue < 1000) {
        return (Math.round(num * 10)/10);
      }
      // thousands
      else if (longestValue < 1000000) {
        return (Math.round(num / 1000 * 10)/10) + 'k';
      }
      // millions
      else if (longestValue < 1000000000) {
        return (Math.round(num / 1000000 * 10)/10) + 'M';
      }
      // billions
      else {
        return (Math.round(num / 1000000000 * 10)/10) + 'B';
      }
    },
    long: function(num) {
      return this.addCommas(num);
    },
    start: function() {
      var num = this.min,
          increment = this.increment;
      this.number = num + Math.abs(num % this.increment);
      return this.number;
    },
    next: function() {
      this.number += this.increment;
      return this.number;
    },
  };

  MeteorCharts.Util.extend(MeteorCharts.Number, MeteorCharts.Formatter);
})();;(function() {
  var SECONDS_IN_MINUTE = 60,
      SECONDS_IN_HOUR = 3600,
      SECONDS_IN_DAY = 86400,
      SECONDS_IN_MONTH = 2628000,
      SECONDS_IN_YEAR = 31500000;

  MeteorCharts.Date = function() {
    MeteorCharts.Formatter.apply(this, arguments);
    this.increment = this.getIncrement();
    this.incrementMultiplier = 1;
    this._setIncrementMultiplier();
  };

  MeteorCharts.Date.prototype = {
    short: function(seconds) {
      var range = this.range,
          date = new moment(seconds * 1000);

      if (range < SECONDS_IN_HOUR) {
        return date.format('h:mma'); // minute
      }
      else if (range < SECONDS_IN_DAY) {
        return date.format('ddd ha'); // hour
      }
      else if (range < SECONDS_IN_MONTH) {
        return date.format('MMM D'); // day
      }
      else if (range < SECONDS_IN_YEAR) {
        return date.format('MMM YYYY');  // month
      }
      else {
        return date.format('YYYY'); // year
      }
    },
    long: function(seconds) {
      var date = date = new moment(seconds * 1000);
      return date.format('MMM D YYYY h:mma'); // day
    },
    start: function() {
      this.mn = moment.utc(this.min * 1000).endOf(this.increment);
      return this.mn.unix();
    },
    next: function() {
      this.mn.add(this.increment, this.incrementMultiplier);
      return this.mn.unix();
    },
    getIncrement: function() {
      var range = this.range;
      if (range < SECONDS_IN_MINUTE) {
        return 'second'; // seconds
      }
      else if (range < SECONDS_IN_HOUR) {
        return 'minute'; // minute
      }
      else if (range < SECONDS_IN_DAY) {
        return 'hour'; // hour
      }
      else if (range < SECONDS_IN_MONTH) {
        return 'day'; // day
      }
      else if (range < SECONDS_IN_YEAR) {
        return 'month';  // month
      }
      else {
        return 'year'; // year
      }
    },
    _setIncrementMultiplier: function() {
      var numIncrements = 0;

      this.each(function() {
        numIncrements++;
      });

      if (numIncrements > this.maxNumberOfLabels) {
        this.incrementMultiplier++;
        this._setIncrementMultiplier();
      }
    }
  };

  MeteorCharts.Util.extend(MeteorCharts.Date, MeteorCharts.Formatter);
})();;;;(function() {
  /*
  var SECONDS_IN_MINUTE = 60,
      SECONDS_IN_HOUR = 3600,
      SECONDS_IN_DAY = 86400,
      SECONDS_IN_MONTH = 2628000,
      SECONDS_IN_YEAR = 31500000;

  MeteorCharts.Seconds = function(min, max, maxNumberOfLabels) {
    MeteorCharts.Formatter.call(this, min, max, maxNumberOfLabels);
    this.base = 60
  };

  MeteorCharts.Seconds.prototype = {
    formatShort: function(seconds) {
      var polarity = seconds < 0 ? '-' : '',
          newSeconds = Math.abs(seconds),
          date = new Date(newSeconds * 1000),
          str = '',
          longestValue = this.getLongestValue();

      if (longestValue < SECONDS_IN_MINUTE) {
        str = date.format('UTC:ss"s"');
      }
      else if (longestValue < SECONDS_IN_HOUR) {
        str = date.format('UTC:MM:ss"m"');
      }
      else if (longestValue < SECONDS_IN_DAY) {
        str = date.format('UTC:HH:MM"h"');
      }
      else if (longestValue < SECONDS_IN_MONTH) {
        str = date.format('UTC:d"d" H"h"'); 
      }
      else { 
        str = date.format('UTC:m"m" d"d"'); 
      }

      return polarity + str;
    }
  };

  MeteorCharts.Util.extend(MeteorCharts.Seconds, MeteorCharts.Formatter);
  */
})();;(function() {
  MeteorCharts.Legend = function(chart) {
    this.chart = chart;
    this.group = new Kinetic.Group();
    this.addLabels();
  };

  MeteorCharts.Legend.prototype = {
    addLabels: function() {
      var chart = this.chart,
          group = this.group,
          model = chart.model,
          _view = chart._view,
          padding = _view.get('padding'),
          lines = model.series,
          len = lines.length,
          x = 0,
          n, dataLine, text, line;

      for (n=0; n<len; n++) {
        dataLine = lines[n];

        line = new Kinetic.Line(MeteorCharts.Util.merge(
          {
            x: x,
            points: [0, 0, 10, 0],
            stroke: chart._view.getSeriesStyle(n).stroke,
            strokeWidth: 3,
            listening: false,
            lineCap: 'round'
          }
        ));

        x += 16;
        text = new Kinetic.Text(MeteorCharts.Util.merge(
          _view.get('legend', 'text'), 
          {
            text: dataLine.title,
            x: x,
            listening: false
          }
        ));

        x += text.getWidth();

        if (n<len-1) {
          x += _view.get('legend', 'spacing');
        }

        line.setY(text.getHeight()/2);

        group.add(line).add(text);
      }

      this.width = x;
      group.setPosition(_view.get('width') - x - padding, padding);

      chart.bottomLayer.add(group);
    },
    getWidth: function() {
      return this.width || 0;
    },    
    hide: function() {
      this.group.hide();
    }
  };
})();;(function() {
  MeteorCharts.Title = function(chart) {
    var chart = this.chart = chart,
        model = this.model = chart.model,
        _view = chart._view,
        str = model.str = '',
        padding = _view.get('padding'),
        text = this.text = new Kinetic.Text(MeteorCharts.Util.merge(
          _view.get('title', 'text'), 
          {
            text: model.title,
            listening: false,
            x: padding,
            y: padding
          }
        ));

    chart.bottomLayer.add(text);
  };

  MeteorCharts.Title.prototype = {
    getWidth: function() {
      return this.text.getWidth() || 0;
    },
    hide: function() {
      this.text.hide();
    }
  };
})();;(function() {
  var APPROX_LABEL_MAX_DISTANCE = 100;

  MeteorCharts.XAxis = function(chart) {
    var maxNumLabels = chart._view.get('width') / APPROX_LABEL_MAX_DISTANCE;

    this.chart = chart;
    this.maxNumberOfLabels = chart._view.get('xAxis', 'maxNumberOfLabels');
    this.formatter = new MeteorCharts[chart._view.get('xAxis', 'formatter')](chart.minX, chart.maxX, maxNumLabels);
    this.addXLabels();
  };

  MeteorCharts.XAxis.prototype = {
    addXLabels: function() {
      var that = this,
          chart = this.chart,
          min = chart.minX,
          scaleX = chart.scaleX,
          formatter = this.formatter,
          x;

      formatter.each(function(n) {
        x = (n - min) * scaleX + chart.dataX;
        that.addXLabel(formatter.short(n), x);
      });      
    }, 
    addXLabel: function(str, x) {
      var chart = this.chart,
          _view = chart._view,
          lines = _view.get('xAxis', 'gridLines'),
          dataY = chart.dataY,
          dataHeight = chart.dataHeight,
          bottomLayer = chart.bottomLayer,
          y = _view.get('height') - _view.get('xAxis', 'text', 'fontSize') - _view.get('padding'),
          text = new Kinetic.Text(MeteorCharts.Util.merge(
            _view.get('xAxis', 'text'),
            {
              text: str,
              x: x,
              y: y,
              listening: false
            }
          )),
          line;

      text.setOffsetX(text.getWidth()/2);

      if (lines !== 'none') {
        line = new Kinetic.Line(MeteorCharts.Util.merge(
          lines, 
          {
            points: [x, dataY, x, dataY + dataHeight],
            listening: false
          }
        ));
 
        bottomLayer.add(line); 
      }

      chart.topLayer.add(text);
    }
  };
})();;(function() {
  var APPROX_LABEL_MAX_DISTANCE = 50;

  MeteorCharts.YAxis = function(chart) {
    var maxNumLabels = chart._view.get('height') / APPROX_LABEL_MAX_DISTANCE;

    this.chart = chart;
    this.maxNumberOfLabels = chart._view.get('yAxis', 'maxNumberOfLabels');
    this.formatter = new MeteorCharts[chart._view.get('yAxis', 'formatter')](chart.minY, chart.maxY, maxNumLabels);
    this.lineGroup = new Kinetic.Group();
    chart.bottomLayer.add(this.lineGroup);
    this.addYLabels();
  };

  MeteorCharts.YAxis.prototype = {
    addYLabels: function() {
      var that = this,
          chart = this.chart,
          formatter = this.formatter,
          minY = chart.minY,
          increment = formatter.getIncrement(),
          dataHeight = chart.dataHeight,
          scaleY = chart.scaleY,
          maxWidth = 0,
          width = 0;

      formatter.each(function(n) {
        width = that.addYLabel(formatter.short(n), Math.round(dataHeight + (minY - n) * scaleY));
        maxWidth = Math.max(width, maxWidth);
      });

      chart.dataX = maxWidth + 10 + chart._view.get('padding');
      this.lineGroup.setX(chart.dataX);
    },
    addYLabel: function(str, y) {
      var chart = this.chart,
          _view = chart._view,
          padding = _view.get('padding'),
          width = _view.get('width'),
          height = chart.dataHeight,
          dataY = chart.dataY,
          bottomLayer = chart.bottomLayer,
          topLayer = chart.topLayer,
          lines = _view.get('yAxis', 'gridLines'),
          text = new Kinetic.Text(MeteorCharts.Util.merge(
            _view.get('yAxis', 'text'),
            {
              text: str,
              x: padding,
              y: y - 8 + dataY,
              listening: false
            }
          )),
          lineGroup = this.lineGroup,
          line;

      if (lines !== 'none') {
        line = new Kinetic.Line(MeteorCharts.Util.merge(
          lines, 
          {
            y: y + dataY,
            listening: false
          }
        ));
 
        lineGroup.add(line); 
      }

      chart.topLayer.add(text);

      return text.getWidth();
    }
  };
})();;(function() {
var EMPTY_STRING = '',
    SPACE = ' ',
    MOUSEMOVE = 'mousemove',
    MOUSEOUT = 'mouseout',
    MOUSEOVER = 'mouseover',
    TOUCHMOVE = 'touchmove',
    TOUCHSTART = 'touchstart',
    TOUCHEND = 'touchend',
    LINE_SPACING = 10,
    Y_LOCK_DURATION = 500;

  MeteorCharts.Tooltip = function(chart) {
    this.chart = chart;
    this.group = new Kinetic.Group();
    this.textGroup = new Kinetic.Group();
    this.title = new Kinetic.Text({});
    this.content = new Kinetic.Text({});
    this.rect = new Kinetic.Rect();
    this.node = new Kinetic.Circle();
    this.connector = new Kinetic.Line();
    this.yTop = true;
    this.yLock = false;

    this.group      
      .add(this.connector)
      .add(this.node)
      .add(this.textGroup
        .add(this.rect)
        .add(this.title)
        .add(this.content)
      );

    chart.interactionLayer.add(this.group);
  };

  MeteorCharts.Tooltip.prototype = {
    reset: function() {
      var _view = this.chart._view,
          padding = _view.get('tooltip', 'rect', 'padding');

      this.title.setAttrs(MeteorCharts.Util.merge(
        _view.get('tooltip', 'title'),
        {
          text: '',
          x: padding,
          y: padding
        }
      ));

      this.content.setAttrs(MeteorCharts.Util.merge(
        _view.get('tooltip', 'content'),
        {
          text: '',
          y: this.title.getHeight() + LINE_SPACING,
          x: padding
        }
      ));

      this.rect.setAttrs(_view.get('tooltip', 'rect'));
      this.node.setAttrs(_view.get('tooltip', 'node'));
      this.connector.setAttrs(_view.get('tooltip', 'connector'));
    },
    render: function(config) {
      var chart = this.chart,
          _view = chart._view,
          textGroup = this.textGroup,
          rect = this.rect,
          title = this.title,
          content = this.content,
          node = this.node,
          connector = this.connector,
          pos = chart.dataToChart(config),
          contentStr = 'x: ' + chart.xAxis.formatter.long(config.x) + ', y: ' + chart.yAxis.formatter.long(config.y),
          padding = _view.get('tooltip', 'rect', 'padding'),
          strokeWidth = _view.get('tooltip', 'rect', 'strokeWidth'),
          chartWidth = _view.get('width'),
          width, height, x, y;

      title.setText(config.title);
      content.setText(contentStr);

      width = Math.max(title.getWidth(), content.getWidth()) + (padding * 2);
      height = title.getHeight() + content.getHeight() + LINE_SPACING + (padding);
      x = pos.x - (width / 2);
      
      // set x
      if (x < strokeWidth) {
        x = strokeWidth;
      }
      else if (x > chartWidth - width - strokeWidth) {
        x = chartWidth - width - strokeWidth;
      }

      textGroup.setX(x);

      // set y
      if (pos.y < (chart.dataY + height + 10)) {
        this.setY(chart.dataY + height + 40);
      }
      else {
        this.setY(chart.dataY);
      }

      rect.setStroke(config.color);
      rect.setWidth(width);
      rect.setHeight(height);

      node.setFill(config.color);
      node.setPosition(pos.x, pos.y);
      connector.setPoints([pos.x, pos.y, pos.x, textGroup.getY()]);
      connector.setStroke(config.color);
    },
    setY: function(y) {
      var textGroup = this.textGroup;

      if (y !== textGroup.getY() && !this.yLock) {
        textGroup.setY(y);
        this.lockY();
      }
    },
    lockY: function() {
      var that = this;

      this.yLock = true;
      setTimeout(function() {
        that.yLock = false;
      }, Y_LOCK_DURATION);
    }
  };
})();;(function() {
  var CONTENT_DBLCLICK = 'contentDblclick',
      MIN_ZOOM_SIZE = 20,

      startDistance = null;

  MeteorCharts.Zoom = function(chart) {
    this.chart = chart;
    this.selecting = false;
    this.startX = 0;
    this.startY = 0;
    this.rect = new Kinetic.Rect({listening: false});

    chart.interactionLayer.add(this.rect);

    this._bind();
  };

  MeteorCharts.Zoom.prototype = {
    reset: function() {
      this.rect.setAttrs(MeteorCharts.Util.merge(
        this.chart._view.get('zoom', 'selection'),
        {
          width: 0,
          height: 0
        }
      ));
    },
    _bind: function() {
      var that = this,
          chart = this.chart,
          stage = chart.stage,
          _view = chart._view;

      stage.on(CONTENT_DBLCLICK, function() {
        chart.minX = null;
        chart.minY = null;
        chart.maxX = null;
        chart.maxY = null;
        chart.draw();
      });
    },
    _startZoomSelect: function() {
      var chart = this.chart,
          pos = chart.stage.getPointerPosition(),
          view = chart.view,
          type = chart._view.get('zoom', 'type');

      this.selecting = true;
      this.startX = pos.x;
      this.startY = type === 'box' ? pos.y : chart.dataY;
      this.rect.setPosition(this.startX, this.startY);
    },
    _resizeZoomSelect: function() {
      var rect = this.rect,
          chart = this.chart,
          pos, view, type;

      if (this.selecting) {
          pos = chart.stage.getPointerPosition();
          view = chart.view;
          type = chart._view.get('zoom', 'type');

        this.rect.setWidth(pos.x - this.startX);
        this.rect.setHeight(type === 'box' ? pos.y - this.startY : chart.dataHeight);

        if (!rect.isVisible()) {
          rect.setVisible(true);
        }
      }
    },
    _pinch: function(evt) {
      var touch1 = evt.touches[0],
          touch2 = evt.touches[1],
          dist = 0,
          diff = 0;

      if(touch1 && touch2) {
        dist = MeteorCharts.Util.getDistance({
          x: touch1.clientX,
          y: touch1.clientY
        }, {
          x: touch2.clientX,
          y: touch2.clientY
        });

        if (startDistance === null) {
          startDistance = dist;
        }

        diff = startDistance - dist;

        //alert(diff);
      }
    },
    _endZoomSelect: function() {
      this.selecting = false;
      this._updateMinMax();
      this.startX = 0;
      this.startY = 0;
      this.rect.setSize(0);
      this.rect.setVisible(false);
    },
    _updateMinMax: function() {
      var chart = this.chart,
          bounds = chart.bounds,
          view = chart.view,
          _view = chart._view,
          type = chart._view.get('zoom', 'type');
          pos = chart.stage.getPointerPosition(),
          startX = this.startX,
          startY = this.startY,
          rect = this.rect,
          chartMinX = Math.min(startX, pos.x),
          chartMinY = type === 'box' ? Math.max(startY, pos.y) : chart.dataY + chart.dataHeight,
          chartMaxX = Math.max(startX, pos.x),
          chartMaxY = type === 'box' ? Math.min(startY, pos.y) : chart.dataY,
          min = chart.chartToData({x:chartMinX, y:chartMinY}),
          max = chart.chartToData({x:chartMaxX, y:chartMaxY});

      //console.log(min.x + ',' + max.x);
      //console.log(min.y + ',' + max.y)

      if (Math.abs(chartMaxX - chartMinX) > MIN_ZOOM_SIZE && Math.abs(chartMaxY - chartMinY) > MIN_ZOOM_SIZE) {
        chart.minX = min.x;
        chart.minY = min.y;
        chart.maxX = max.x;
        chart.maxY = max.y;
        chart.draw();
      }

    }
  };
})();;(function() {
  var ADD_NODES_THRESHOLD = 15;

  MeteorCharts.Line = function(config) {
    // super
    MeteorCharts.Chart.call(this, config);
    this.__init(config);
  };

  MeteorCharts.Line.prototype = {
    __init: function() {
      // interaction components
      this.tooltip = new MeteorCharts.Tooltip(this);
      this.zoom = new MeteorCharts.Zoom(this);
      this.draw();
      this._addContent();
    },
    setBounds: function() {
      var that = this,
          autoMinMax = this.getAutoMinMax(),
          _view = this._view,
          viewMinX = _view.get('xAxis', 'min'),
          viewMinY = _view.get('yAxis', 'min'),
          viewMaxX = _view.get('xAxis', 'max'),
          viewMaxY = _view.get('yAxis', 'max');

        if (!this.minX && !this.minY && !this.maxX && !this.maxY) {
          this.minX = viewMinX === 'auto' ? autoMinMax.minX : viewMinX;
          this.minY = viewMinY === 'auto' ? autoMinMax.minY : viewMinY;
          this.maxX = viewMaxX === 'auto' ? autoMinMax.maxX : viewMaxX;
          this.maxY = viewMaxY === 'auto' ? autoMinMax.maxY : viewMaxY;
        }
    },
    _draw: function() {
      var that = this,
          _view = this._view,
          padding = _view.get('padding'),
          stage = this.stage,
          container = stage.getContainer();

      this.zoom.reset();
      this.tooltip.reset();

      this.bottomLayer.destroyChildren();
      this.dataLayer.destroyChildren();
      this.topLayer.destroyChildren();

      // TODO: width and height should be cached
      //stage.setSize(view.width, view.height);

      this.setBounds();

      container.style.backgroundColor = _view.get('backgroundColor');

      this.dataY = _view.get('title', 'text', 'fontSize') + _view.get('spacing') + padding;
      this.dataHeight = _view.get('height') - this.dataY - _view.get('xAxis', 'text', 'fontSize') - _view.get('spacing') - padding;
      this.scaleY = this.dataHeight / (this.maxY - this.minY);
      this.yAxis = new MeteorCharts.YAxis(this);
      this.dataWidth = _view.get('width') - this.dataX - padding;

      this.yAxis.lineGroup.getChildren().each(function(node) {
        node.setPoints([0, 0, that.dataWidth, 0]);
      });

      this.scaleX = this.dataWidth / (this.maxX - this.minX);
      this.xAxis = new MeteorCharts.XAxis(this);
      this.legend = new MeteorCharts.Legend(this);
      this.title = new MeteorCharts.Title(this);

      if (this.title.getWidth() + this.legend.getWidth() + (padding*2) + _view.get('spacing')> _view.get('width')) {
        this.legend.hide();
      }

      // add lines and labels
      this.addLines();

      // update interaction layer
      this.pointerMove();
      this.dataLayer.setClip([this.dataX, this.dataY, this.dataWidth, this.dataHeight]);
    },
    getAutoMinMax: function() {
      var model = this.model,
          lines = model.series,
          len = lines.length,
          firstPoint = lines[0].points[0],
          firstPointX = firstPoint.x,
          firstPointY = firstPoint.y,
          minX = firstPointX,
          minY = firstPointY,
          maxX = firstPointX,
          maxY = firstPointY,
          n, i, pointsLen, point, pointX, pointY, line, points;

      for (n=0; n<len; n++) {
        line = lines[n];
        points = line.points;
        pointsLen = points.length;

        for (i=0; i<pointsLen; i++) {
          point = points[i];
          pointX = point.x;
          pointY = point.y;
          minX = Math.min(minX, pointX);
          minY = Math.min(minY, pointY);
          maxX = Math.max(maxX, pointX);
          maxY = Math.max(maxY, pointY);
        }
      }

      return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
      };
    },
    _getNearestPoint: function(pos) {
      var _view = this._view,
          model = this.model,
          lines = model.series,
          lineLen = lines.length,
          minX = this.minX,
          maxX = this.maxX,
          minY = this.minY,
          maxY = this.maxY,
          nearestPoint = null,
          smallestDiff = Infinity,
          n, i, line, points, pointsLen, color, title, point, pointX, pointY, diff;

      for (n=0; n<lineLen; n++) {
        line = lines[n];
        points = line.points;
        pointsLen = points.length;
        color = _view.getSeriesStyle(n).stroke;
        title = line.title;

        for (i=0; i<pointsLen; i++) {
          point = points[i];
          pointX = point.x;
          pointY = point.y;
          diff = MeteorCharts.Util.getDistance(pos, this.dataToChart(point));

          if (pointX >= minX && pointX <= maxX 
              && pointY >= minY && pointY <=maxY
              && diff < smallestDiff) { 

            smallestDiff = diff;
            nearestPoint = {
              color: color,
              title: title,
              x: pointX,
              y: pointY
            };
          }
        }
      }

      return nearestPoint;
    },
    pointerMove: function() {
      var pos = this.stage.getPointerPosition(),
          nearestPoint;

      if (pos) {
        nearestPoint = this._getNearestPoint(pos);

        if (nearestPoint) {
          this.tooltip.render(nearestPoint);
          this.tooltip.group.show();
        }
        else {
          this.tooltip.group.hide();
        }
      }
    },
    dataToChartX: function(x) {
      return (x-this.minX) * this.scaleX + this.dataX;
    },
    dataToChartY: function(y) {
      return this.dataHeight - ((y - this.minY) * this.scaleY) + this.dataY;
    },
    dataToChart: function(point) {
      return {
        x: this.dataToChartX(point.x),
        y: this.dataToChartY(point.y)
      };
    },
    dataToChartPoints: function(points) {
      var arr = [],
          len = points.length,
          n, point;

      for (n=0; n<len; n++) {
        point = points[n];

        arr.push(this.dataToChart(point));
      }

      return arr;
    },
    chartToData: function(point) {
      return {
        x: ((point.x - this.dataX) / this.scaleX) + this.minX,
        y: this.minY - ((point.y - this.dataHeight - this.dataY) / this.scaleY)
      };
    },
    addLine: function(points, style, addNodes) {
      var lineObj = new Kinetic.Line(MeteorCharts.Util.merge(
        style,
        {
          points: points,
          listening: false
        }));
      this.dataLayer.add(lineObj);

      if (addNodes) {
        this.addNodes(points, style);
      }
    },
    addNodes: function(points, style) {
      var _view = this._view,
          len = points.length,
          dataLayer = this.dataLayer,
          n, point;

      for (n=0; n<len; n++) {
        point = points[n];
        // dataLayer.add(new Kinetic.Circle({
          // x: point.x,
          // y: point.y,
          // radius: 5,
          // stroke: _view.get('backgroundColor'),
          // strokeWidth: 3,
          // fill: style.stroke,
          // listening: false
        // }));
      }
    },
    getStartEnd: function(points) {
      var minX = this.minX,
          maxX = this.maxX,
          len = points.length,
          start, end, i, point;

      for (i=0; i<len; i++) {
        point = points[i];
        if (start === undefined && point.x >= minX) {
          start = i === 0 ? 0 : i -1;
        }
        if (end === undefined && point.x >= maxX) {
          end = i;
          break;
        }
      }

      if (end === undefined) {
        end = len-1;
      }

      return {
        start: start,
        end: end
      };
    },
    addLines: function() {
      var model = this.model,
        lines = model.series,
        len = lines.length,
        style, 
        n, 
        line, 
        points, 
        addNodes, 
        startEnd, 
        start, 
        end, 
        chartRange,
        newPoints;

      for (n=0; n<len; n++) {
        line = lines[n];
        points = line.points;
        style = this._view.getSeriesStyle(n);
        newPoints = [];
        startEnd = this.getStartEnd(points);
        start = startEnd.start;
        end = startEnd.end;
        addNodes = false;

        if (start !== undefined && end !== undefined) {
          chartRange = this.dataToChartX(points[end].x) - this.dataToChartX(points[start].x);
          addNodes = chartRange / (end - start) > ADD_NODES_THRESHOLD;
        }

        newPoints = points.slice(start, end + 1);

        if (newPoints.length > 1) {
          this.addLine(this.dataToChartPoints(newPoints), style, addNodes);
        }
      }
    },
    _pan: function() {
      var pos = this.stage.getPointerPosition(),
          _view = this._view,
          diffX, diffY;

      if (this.lastPos) {
        diffX = (pos.x - this.lastPos.x) / this.scaleX;
        diffY = (pos.y - this.lastPos.y) / this.scaleY;
        this.minX = this.minX - diffX;
        this.minY = this.minY + diffY;
        this.maxX = this.maxX - diffX;
        this.maxY = this.maxY + diffY;
        this.batchDraw();
      }
    },
    _getContent: function() {
      var _view = this._view,
          model = this.model,
          series = model.series,
          len = series.length,
          n, line, points, firstPoint, lastPoint, change,
          xFormatter = this.xAxis.formatter,
          yFormatter = this.yAxis.formatter,
          content = [
            '<h2>MeteorCharts Line Chart Description</h2>',
            '<p>',
            'The title of the chart is "' + model.title + '". ',
            'The x axis begins at "' + xFormatter.short(this.minX) + '" and ends at "' + xFormatter.short(this.maxX) + '" from left to right. ',
            'The y axis begins at "' + yFormatter.short(this.minY) + '" and ends at "' + yFormatter.short(this.maxY) + '" from bottom to top. ',
            'There are ' + model.series.length + ' series lines. ',
          ];

      for (n=0; n<len; n++) {
        line = series[n];
        points = line.points;
        firstPoint = points[0];
        lastPoint = points[points.length - 1];
        change = lastPoint.y >= firstPoint.y ? 'rises' : 'falls';
        content.push('The line titled "' + series[n].title + '" begins at "' + yFormatter.short(firstPoint.y) + '" ');
        content.push('and ' + change + ' to "' + yFormatter.short(lastPoint.y) + '". ');
      }

      content.push('</p>');

      return content.join('');
    }
  };

  MeteorCharts.Util.extend(MeteorCharts.Line, MeteorCharts.Chart);
})();