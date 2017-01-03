'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _pofile = require('pofile');

var _pofile2 = _interopRequireDefault(_pofile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Translation = function () {
  function Translation(filename, lineNumber, msg) {
    _classCallCheck(this, Translation);

    this.filename = filename;
    this.lineNumber = lineNumber;
    this.msg = msg;
  }

  _createClass(Translation, [{
    key: 'toPofileItem',
    value: function toPofileItem() {
      var item = new _pofile2.default.Item();
      item.msgid = this.msg;
      item.msgctxt = null;
      item.references = [this.filename + ':' + this.lineNumber];
      item.msgid_plural = null;
      item.msgstr = [];
      item.extractedComments = [];
      return item;
    }
  }]);

  return Translation;
}();

var Extractor = function () {
  function Extractor(options) {
    _classCallCheck(this, Extractor);

    this.options = _extends({
      startDelim: '{{',
      endDelim: '}}',
      attributes: ['v-text']
    }, options);
    this.translations = [];
  }

  _createClass(Extractor, [{
    key: 'parse',
    value: function parse(filename, content) {
      var $ = _cheerio2.default.load(content, {
        decodeEntities: false,
        withStartIndices: true
      });

      var translations = $('template *').map(function (i, el) {
        var node = $(el);
        var msg = this.extractTranslationMessage(node);
        if (msg) {
          var truncatedText = content.substr(0, el.startIndex);
          var lineNumber = truncatedText.split(/\r\n|\r|\n/).length;
          return new Translation(filename, lineNumber, msg);
        }
      }.bind(this)).get();

      this.translations = this.translations.concat(translations);
    }
  }, {
    key: 'extractTranslationMessage',
    value: function extractTranslationMessage(node) {
      // extract from attributes
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.options.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var attr = _step.value;

          if (node.attr(attr)) {
            var content = node.attr(attr);

            // match text with format $t([string literal]) 
            var re = new RegExp('.*\\$t\\([\'\"\`](.*)[\'\"\`]\\).*');
            var matches = re.exec(content);

            if (matches) {
              return matches[1];
            }
          }
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
  }, {
    key: 'toPofile',
    value: function toPofile() {
      var pofile = new _pofile2.default();
      pofile.headers = {
        'Last-Translator': 'vue-i18n-xgettext',
        'Content-Type': 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding': '8bit',
        'MIME-Version': '1.1'
      };

      var itemMapping = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.translations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var translation = _step2.value;

          var _item = translation.toPofileItem();
          if (!itemMapping[_item.msgid]) {
            itemMapping[_item.msgid] = _item;
          } else {
            var oldItem = itemMapping[_item.msgid];
            // TODO: deal with plurals/context
            if (_item.references.length && oldItem.references.indexOf(_item.references[0]) === -1) {
              oldItem.references.push(_item.references[0]);
            }
            if (_item.extractedComments.length && soldItem.extractedComments.indexOf(_item.extractedComments[0]) === -1) {
              oldItem.extractedComments.push(_item.extractedComments[0]);
            }
          }
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

      for (var msgid in itemMapping) {
        var item = itemMapping[msgid];
        pofile.items.push(item);
      }

      pofile.items.sort(function (a, b) {
        return a.msgid.localeCompare(b.msgid);
      });
      return pofile;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.toPofile().toString();
    }
  }]);

  return Extractor;
}();

exports.default = Extractor;
//# sourceMappingURL=extractor.js.map