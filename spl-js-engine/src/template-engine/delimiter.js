const _DEFAULT_START_DELIMITER = '/*%';
const _DEFAULT_END_DELIMITER = '%*/';
const _jsExpression =
  /(^([ \n\t\r])*(var|if|for|else|switch|case|break|{|}|;))(.*)?/g;
const _featureExpression = /feature.[^ |)&]*/g;
const _dataExpression = /data.[^ |)&]*/g;


export default class Delimiter {
  constructor(startDelimiter = _DEFAULT_START_DELIMITER,
              endDelimiter = _DEFAULT_END_DELIMITER) {
    this.start = startDelimiter;
    this.end = endDelimiter;

    this.regular = new RegExp('(([ \\r\\t])+\|\\n\|^)' +
      _escapeRegExpStr(this.start) +
      '([^=])(([^' +
      _escapeRegExpStr(this.end[0]) +
      ']|\\\\' +
      _escapeRegExpStr(this.end[0]) +
      ')+?)' +
      _escapeRegExpStr(this.end) +
      '\\n\|' +
      _escapeRegExpStr(this.start) +
      '(([^' +
      // _escapeRegExpStr(this.end[0]) +
      ']|\\\\' +
      _escapeRegExpStr(this.end[0]) +
      ')+?)' +
      _escapeRegExpStr(this.end), 'g');

    this.header = new RegExp('^' +
      _escapeRegExpStr(this.start) +
      '@(([^' +
      _escapeRegExpStr(this.end[0]) +
      ']|\\\\' +
      _escapeRegExpStr(this.end[0]) +
      ')+?)' +
      _escapeRegExpStr(this.end), 'g');

    this.js = _jsExpression;
    this.feature = _featureExpression;
    this.data = _dataExpression;
  }

  toString() {
    return `Start: ${this.start}, End: ${this.end}`;
  }
}

const _escapeRegExpStr = str =>
  String(str).replace(/[-/|\\{}()[\]^$+*?.]/g, '\\$&');
