import Delimiter from './delimiter.js';

export default class Engine {
  constructor(delimiters = {}, extraJS = '') {
    this.delimiters = delimiters;
    if (!this.delimiters.default) {
      this.delimiters.default = new Delimiter();
    }
    this.extraJS = extraJS || '';
  }

  getDelimiter(extension = 'default') {
    if (this.delimiters[extension])
      return this.delimiters[extension];
    else
      return this.delimiters.default;
  }

  getTemplateHelperMethods() {
    return `function normalize(str, upper) {
                    return str
                        .normalize('NFKD')
                        .replace(/[\u0300-\u036F]/g, '')
                        .replace(/[-_]+/g, ' ')
                        .replace(/[^\\w\\s]/gi, '')
                        .replace(/\\s(.)/g, function($1) { return $1.toUpperCase(); })
                        .replace(/\\s/g, '')
                        .replace(/^(.)/, function($1) { return upper ? $1.toUpperCase() : $1.toLowerCase(); });
                }\n
                function log(str) {
                    console.log(str);
                }\n
                function comment(str) {
                }\n
                ${this.extraJS}`;
  }
}
