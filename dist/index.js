#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _extractor = require('./extractor.js');

var _extractor2 = _interopRequireDefault(_extractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist2.default)(process.argv.slice(2));
var files = argv._.sort() || [];
var attributes = argv.attribute || [];
var outputFile = argv.output || null;

if (!files || files.length === 0) {
  console.log('Usage: vue-i18n-xgettext [--attribute ATTRIBUTE] [--output OUTPUT_FILE] FILES');
  process.exit(1);
}

var defaultAttribtues = ['v-text'];
if (typeof attributes === 'string') {
  defaultAttribtues.push(attributes);
} else {
  defaultAttribtues.concat(attributes);
}

var extractor = new _extractor2.default({
  attributes: defaultAttribtues
});

files.forEach(function (filename) {
  var extension = filename.split('.').pop();
  if (extension !== 'vue') {
    console.log('file ' + filename + ' with extension ' + extension + ' will not be processed (skipped)');
    return;
  }

  var data = _fs2.default.readFileSync(filename, { encoding: 'utf-8' }).toString();

  try {
    extractor.parse(filename, data);
  } catch (e) {
    console.trace(e);
    process.exit(1);
  }
});

var output = extractor.toString();
if (outputFile) {
  _fs2.default.writeFileSync(outputFile, output);
} else {
  console.log(output);
}
//# sourceMappingURL=index.js.map