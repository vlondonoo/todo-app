import Processor from './processor';
import Delimiter from './delimiter';
import Analyser from './analyser';
import FileGenerator from './file-generator';

export default class TemplateEngine {
  constructor({startDelimiter, endDelimiter} = {}, extraJS = '') {
    this.delimiters = {};
    if (startDelimiter && endDelimiter) {
      this.addDelimiter('default', startDelimiter, endDelimiter);
    }
    this.extraJS = extraJS;
  }

  createProcessor(features, data) {
    return new Processor(features, data, this.delimiters, this.extraJS);
  }

  createFileGenerator(features, data) {
    return new FileGenerator(features, data, this.delimiters, this.extraJS);
  }

  createAnalyser() {
    return new Analyser(this.delimiters);
  }

  addDelimiter(type, start, end) {
    this.delimiters[type] = new Delimiter(start, end);
  }

  delimiterFor(extension) {
    return this.delimiters[extension];
  }
}
